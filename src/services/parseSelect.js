import cheerio from 'react-native-cheerio';

export const parseManganeloSelect = (html) => {
  const $ = cheerio.load(html);
  const infoImageUrl = $('span.info-image img').attr('src');
  const status = $('td.table-value').eq(2).text();
  const lastUpdated = $('span.stre-value').eq(0).text();
  const description = $('div.panel-story-info-description').first().text();
  const cleanedDescription = description
    .trim()
    .replace('Description :', '')
    .trim();

  const lastChapter = $('ul.row-content-chapter li.a-h a.chapter-name')
    .first()
    .text();

  const chaptersList = $('ul.row-content-chapter li.a-h');
  const chapterRegEx = /(chapter\/)(.+)/;
  const chapterRefs = [];
  chaptersList.each((i, el) => {
    const chapter = $(el).find('a.chapter-name');
    const found = chapterRegEx.exec($(chapter).attr('href'));

    const prev = chapterRefs[chapterRefs.length - 1];
    chapterRefs.push({
      chapterRef: found[2],
      name: $(chapter).text(),
      date: $(el).find('.chapter-time').attr('title'),
      next: prev ? prev.chapterRef : null,
    });
  });

  return {
    infoImageUrl,
    status,
    lastUpdated,
    cleanedDescription,
    lastChapter,
    chapterRefs,
  };
};

/**
 * Parses the html string into an Object representation of the page
 * @param {string} html
 * @returns {object} object containing many things
 */
export const parseManganatoSelect = (html) => {
  const $ = cheerio.load(html);
  const infoImageUrl = $('span.info-image img').attr('src');
  const status = $('td.table-value').eq(2).text();
  const lastUpdated = $('span.stre-value').eq(0).text();
  const description = $('div.panel-story-info-description').first().text();
  const cleanedDescription = description
    .trim()
    .replace('Description :', '')
    .trim();

  const lastChapter = $('ul.row-content-chapter li.a-h a.chapter-name')
    .first()
    .text();

  const chaptersList = $('ul.row-content-chapter li.a-h');
  const chapterRegEx = /chapter-.+/;
  const chapterRefs = [];
  chaptersList.each((i, el) => {
    const chapter = $(el).find('a.chapter-name');
    const found = chapterRegEx.exec($(chapter).attr('href'));

    const prev = chapterRefs[chapterRefs.length - 1];
    chapterRefs.push({
      chapterRef: found[0],
      name: $(chapter).text(),
      date: $(el).find('.chapter-time').attr('title'),
      next: prev ? prev.chapterRef : null,
    });
  });

  return {
    infoImageUrl,
    status,
    lastUpdated,
    cleanedDescription,
    lastChapter,
    chapterRefs,
  };
}