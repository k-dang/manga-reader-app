const axios = require('axios');
const cheerio = require('cheerio');

const test = async () => {
  const response = await axios.get(`https://manganelo.com/manga/az918766`);

  const $ = cheerio.load(response.data);

  const infoImageUrl = $('span.info-image img').attr('src');
  console.log(infoImageUrl);

  const status = $('td.table-value').eq(2).text();
  // console.log(status);

  const lastUpdated = $('span.stre-value').eq(0).text();
  // console.log(lastUpdated);

  const description = $('div.panel-story-info-description').first().text();
  // console.log(description.trim().replace('Description :', '').trim());

  const lastChapter = $('ul.row-content-chapter li.a-h a.chapter-name')
    .first()
    .text();
  // console.log(lastChapter);

  const chaptersList = $('ul.row-content-chapter li.a-h');
  const chapterRegEx = /(chapter\/)(.+)/;
  chaptersList.each((i, el) => {
    const chapter = $(el).find('a.chapter-name');
    const found = chapterRegEx.exec($(chapter).attr('href'));
    console.log(found[2]);
    console.log($(chapter).text());
    console.log($(el).find('.chapter-time').attr('title'));
  });
  // const searchResults = $('.search-story-item a.item-img');
  // searchResults.each((i, result) => {
  //   console.log($(result).attr('href'));
  //   console.log($(result).attr('title'));
  //   console.log($(result).find('img').attr('src'));
  // });
  // for (result in searchResults){
  //   console.log(result.html());
  // };
};

// test();

const chapter = async () => {
  const response = await axios.get(
    `https://manganelo.com/chapter/az918766/chapter_18`
  );
  const $ = cheerio.load(response.data);

  const imageTags = $('.container-chapter-reader img');
  imageTags.each((i, el) => {
    console.log($(el).attr('src'));
  });
};

chapter();
