import mangadex from '../api/mangadex';
import { sources } from '../store/search/constants';

/**
 * get search results from mangadex api
 * @param {string} searchTerm - search term to search for
 * @param {integer} offset - offset of results (for pagination)
 * @returns {[object, number]} tuple containing results object & total entries
 *
 * return results object format
 * {
 *  id: '',
 *  title: '',
 *  imageUrl: ''
 *  source: MANGADEX
 * }
 */
export const getSearchResults = async (searchTerm, offset = 0) => {
  const searchSafeString = encodeURIComponent(searchTerm);

  const response = await mangadex.get(
    `/manga?title=${searchSafeString}&includes[]=cover_art&limit=20&offset=${offset}`
  );

  const results = [];
  response.data.results.forEach(({ data, relationships }) => {
    const id = data.id;
    const coverArt = relationships.find(({ type }) => type === 'cover_art');

    // https://uploads.mangadex.org/covers/1cebf72e-d402-4ac3-9341-dd9d1d5f5147/f9f7b291-1e63-40c3-9143-5573cffd0618.png
    let coverUrl = '';
    if (coverArt === undefined) {
      coverUrl = 'https://imgur.com/N5nDw9J';
    } else {
      coverUrl = `https://uploads.mangadex.org/covers/${id}/${coverArt.attributes.fileName}`;
    }

    const altTitle = data.attributes?.altTitles[0]?.en ?? 'No title available';
    const title = data.attributes?.title?.en ?? altTitle;

    results.push({
      id: id,
      title: title,
      imageUrl: coverUrl,
      source: sources.MANGADEX,
    });
  });

  return [results, response.data.total];
};

/**
 * get manga details from mangadex api
 * @param {string} mangaId - manga id from manga dex
 * @returns {object} object containing manga details
 */
export const getMangaDetail = async (mangaId) => {
  const response = await mangadex.get(`/manga/${mangaId}?includes[]=cover_art`);
  const data = response.data;
  const attributes = data.data.attributes;

  const coverArt = data.relationships.find(({ type }) => type === 'cover_art');
  let coverUrl = '';
  if (coverArt === undefined) {
    coverUrl = 'https://imgur.com/N5nDw9J';
  } else {
    coverUrl = `https://uploads.mangadex.org/covers/${mangaId}/${coverArt.attributes.fileName}`;
  }
  const description = attributes.description.hasOwnProperty('en')
    ? attributes.description.en
    : 'No english description';

  return {
    infoImageUrl: coverUrl,
    status: attributes.status,
    lastUpdated: attributes.updatedAt, // unused
    cleanedDescription: description,
    lastChapter: attributes.lastChapter, // unused, might be null for ongoing
    source: sources.MANGADEX,
    // chapterRefs: seperate API for this field
  };
};

/**
 * Get parsed list of all chapters objects for a given mangaId
 * @param {string} mangaId - manga id from manga dex
 * @returns [chapterObject] array of objects containing all chapter details
 */
export const getMangaFeed = async (mangaId) => {
  // by default limit is 100 results
  const response = await mangadex.get(
    `/manga/${mangaId}/feed?order[chapter]=desc&offset=0&translatedLanguage[]=en`
  );
  const total = response.data.total;
  const allResults = parseChapters(response.data.results);

  const promises = [];
  for (let i = 100; i < total; i += 100) {
    promises.push(getChapters(mangaId, i));
  }

  const end = await Promise.all(promises);
  const flatten = end.reduce((prev, curr) => {
    return [...prev, ...curr];
  }, []);

  allResults.push(...flatten);

  // now we do the processing
  const seen = new Set();
  const filteredResults = allResults.filter((element) => {
    if (seen.has(element.number)) {
      return false;
    }
    seen.add(element.number);
    return true;
  });

  filteredResults.forEach((element, index, chapters) => {
    const prevIndex = index > 0 ? index - 1 : null;
    const prevChapter = prevIndex != null ? chapters[prevIndex] : null;
    element.next = prevChapter ? prevChapter.chapterRef : null;
  });

  return filteredResults;
};

/**
 * Get parsed list of chapter objects for a given mangaId and offset
 * @param {string} mangaId - manga id from manga dex
 * @param {number} offset - offset for results (pagination)
 * @returns [chapterObject] array of objects containing chapter details
 */
export const getChapters = async (mangaId, offset) => {
  const response = await mangadex.get(
    `/manga/${mangaId}/feed?order[chapter]=desc&offset=${offset}&translatedLanguage[]=en`
  );

  return parseChapters(response.data.results);
};

/**
 * Parses results array to chapterObject
 * @param {[object]} resultsList - array of result objects to parse
 * @returns [chapterObject] array of objects containing chapter details
 */
const parseChapters = (resultsList) => {
  const chapters = [];
  resultsList.forEach(({ data, relationships }) => {
    if (data.attributes.translatedLanguage === 'en') {
      const chapterNumber = data.attributes.chapter;
      const title = data.attributes.title === null ? '' : data.attributes.title;
      const publishDate = data.attributes.publishAt;

      // const sg = relationships.find(({ type }) => type === 'scanlation_group');

      chapters.push({
        chapterRef: data.id,
        number: chapterNumber,
        name: `Chapter ${chapterNumber}${title ? ' ' + title : title}`, // add extra space when title is valid
        date: publishDate,
        // next: prev ? prev.chapterRef : null,
      });
    }
  });
  return chapters;
};

export const getChapterImages = async (chapterRef) => {
  const response = await mangadex.get(`/chapter/${chapterRef}`);
  const attributes = response.data.data.attributes;

  const chapterHash = attributes.hash;
  const imageUrls = [];
  attributes.data.forEach((fileName) => {
    imageUrls.push({
      url: `https://uploads.mangadex.org/data/${chapterHash}/${fileName}`,
    });
  });

  return imageUrls;
};
