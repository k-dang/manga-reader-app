import cheerio from 'react-native-cheerio';
import { sources } from '../store/search/constants';

export const parseManganeloSearch = (html) => {
  const $ = cheerio.load(html);
  const searchResults = $('.search-story-item a.item-img');
  const results = [];
  const idRegEx = /(manga\/)(\w+)/;
  searchResults.each((i, result) => {
    const onClickUrl = $(result).attr('href');

    let foundId = i;
    if (onClickUrl != undefined) {
      foundId = idRegEx.exec(onClickUrl);
    }

    results.push({
      id: foundId[2],
      title: $(result).attr('title'),
      imageUrl: $(result).find('img').attr('src'),
      // onClickUrl: onClickUrl,
    });
  });

  const lastPageHref = $('.group-page a').last().attr('href');
  const pageNumberRegEx = /(page=)(\d+)/g;

  let totalPages = 1;
  if (lastPageHref != undefined) {
    totalPages = pageNumberRegEx.exec(lastPageHref)[2];
  }

  return [results, totalPages];
};

export const parseManganeloAdvancedSearch = (html) => {
  const $ = cheerio.load(html);
  const genreResults = $('.content-genres-item .genres-item-img');
  const results = [];
  const idRegEx = /(manga\/)(\w+)/;
  genreResults.each((i, result) => {
    const onClickUrl = $(result).attr('href');

    let foundId = i;
    if (onClickUrl != undefined) {
      foundId = idRegEx.exec(onClickUrl);
    }

    results.push({
      id: foundId[2],
      title: $(result).attr('title'),
      imageUrl: $(result).find('img').attr('src'),
    });
  });

  const lastPageHref = $('.group-page a').last().attr('href');
  const pageNumberRegEx = /(page=)(\d+)/g;

  let totalPages = 1;
  if (lastPageHref != undefined) {
    totalPages = pageNumberRegEx.exec(lastPageHref)[2];
  }

  return [results, totalPages];
};

/**
 * Parses the html string and returns a tuple containing results & total pages
 * @param {string} html
 * @returns {[object, number]} tuple containing results object & total pages
 *
 * return results object format
 * {
 *  id: '',
 *  title: '',
 *  imageUrl: ''
 * }
 */
export const parseManganatoSearch = (html) => {
  const $ = cheerio.load(html);
  const searchResults = $('.search-story-item a.item-img');
  const results = [];
  const idRegEx = /(com\/)([\w\-]+)/;
  searchResults.each((i, result) => {
    const onClickUrl = $(result).attr('href');

    let foundId = i;
    if (onClickUrl != undefined) {
      foundId = idRegEx.exec(onClickUrl);
    }

    results.push({
      id: foundId[2],
      title: $(result).attr('title'),
      imageUrl: $(result).find('img').attr('src'),
      source: sources.MANGANATO,
      // onClickUrl: onClickUrl,
    });
  });

  const lastPageHref = $('.group-page a').last().attr('href');
  const pageNumberRegEx = /(page=)(\d+)/g;

  let totalPages = 1;
  if (lastPageHref != undefined) {
    totalPages = pageNumberRegEx.exec(lastPageHref)[2];
  }

  return [results, totalPages];
};

/**
 * Parses the html string and returns a tuple containing results & total pages
 * @param {string} html
 * @returns {[object, number]} tuple containing results object & total pages
 *
 * return object format
 * {
 *  id: '',
 *  title: '',
 *  imageUrl: ''
 * }
 */
export const parseManganatoAdvancedSearch = (html) => {
  const $ = cheerio.load(html);
  const genreResults = $('.content-genres-item .genres-item-img');
  const results = [];
  const idRegEx = /(com\/)([\w\-]+)/;
  genreResults.each((i, result) => {
    const onClickUrl = $(result).attr('href');

    let foundId = i;
    if (onClickUrl != undefined) {
      foundId = idRegEx.exec(onClickUrl);
    }

    results.push({
      id: foundId[2],
      title: $(result).attr('title'),
      imageUrl: $(result).find('img').attr('src'),
      source: sources.MANGANATO,
    });
  });

  const lastPageHref = $('.group-page a').last().attr('href');
  const pageNumberRegEx = /(page=)(\d+)/g;

  let totalPages = 1;
  if (lastPageHref != undefined) {
    totalPages = pageNumberRegEx.exec(lastPageHref)[2];
  }

  return [results, totalPages];
};
