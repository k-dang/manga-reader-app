import cheerio from 'react-native-cheerio';

export const parseManganeloChapter = (html) => {
  const $ = cheerio.load(html);
  const imageTags = $('.container-chapter-reader img');

  const results = [];
  imageTags.each((i, el) => {
    results.push({
      url: $(el).attr('src'),
    });
  });
  return results;
};

export const parseManganatoChapter = (html) => {
  const $ = cheerio.load(html);
  const imageTags = $('.container-chapter-reader img');

  const results = [];
  imageTags.each((i, el) => {
    results.push({
      url: $(el).attr('src'),
    });
  });
  return results;
};