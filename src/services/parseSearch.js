import cheerio from 'react-native-cheerio';

export const parseManganeloSearch = (html) => {
  const $ = cheerio.load(html);
  const searchResults = $('.search-story-item a.item-img');
  const results = [];
  const idRegEx = /(manga\/)(\w+)/;
  searchResults.each((i, result) => {
    const onClickUrl = $(result).attr('href');

    let foundId = i
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
