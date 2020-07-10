import cheerio from 'react-native-cheerio';

export const parseManganeloChapter = (html) => {
  const $ = cheerio.load(html);
  const imageTags = $('.container-chapter-reader img');

  const results = [];
  imageTags.each((i, el) => {
    // https://avt.mkklcdnv6.com/34/e/19-1583500424.jpg
    // $(el).attr('src')
    // results.push({
    //   url: 'https://webhook.site/522e5daf-b2d8-4aca-a185-482fa64dedf5',
    // });
    results.push({
      url: $(el).attr('src'),
    });
  });
  return results;
};
