import mangadex from '../api/mangadex';

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

    results.push({
      id: id,
      title: data.attributes.title.en,
      imageUrl: coverUrl,
    });
  });

  return [results, response.data.total];
};
