export const getGenreTopUrl = (genre) => {
  let genreQuery = '';
  switch (genre) {
    case 'Action': {
      genreQuery = '2'
      break;
    }
    case 'Comedy': {
      genreQuery = '6'
      break;
    }
    case 'Fantasy': {
      genreQuery = '12'
      break;
    }
    case 'Isekai': {
      genreQuery = '45'
      break;
    }
    case 'Shoujo': {
      genreQuery = '31'
      break;
    }
    case 'Romance': {
      genreQuery = '27'
      break;
    }
    case 'Slice of life': {
      genreQuery = '35'
      break;
    }
    case 'Hot': {
      return '/advanced_search?s=all&orby=topview'
    }
  }

  return `/advanced_search?s=all&g_i=_${genreQuery}_&orby=topview`;
};
