import {
  SELECT_MANGA_REQUEST,
  SELECT_MANGA_SUCCESS,
  SELECT_MANGA_FAILURE,
  SELECT_MANGA,
  REVERSE_CHAPTERS,
} from './constants';

// mangaDetailsByTitle is a dictionary of
// mangaTitle : {
//   infoImageUrl: ''
//   status: ''
//   lastUpdated: ''
//   cleanedDescription: ''
//   lastChapter: ''
//   chapterRefs: [{
//     chapterRef: '',
//     name: ''
//     date: ''
//   }]
// }
const initialState = {
  isFetching: false,
  error: null,
  selectedManga: '',
  mangaDetailsByTitle: {},
};
const select = (state = initialState, action) => {
  switch (action.type) {
    case SELECT_MANGA_REQUEST: {
      const { mangaTitle } = action.payload;
      return {
        ...state,
        isFetching: true,
        error: null,
        selectedManga: mangaTitle,
      };
    }
    case SELECT_MANGA_SUCCESS: {
      const { mangaTitle, result } = action.payload;
      return {
        ...state,
        isFetching: false,
        mangaDetailsByTitle: {
          ...state.mangaDetailsByTitle,
          [mangaTitle]: { ...result, didInvalidate: false },
        },
      };
    }
    case SELECT_MANGA_FAILURE: {
      return {
        ...state,
        isFetching: false,
        error: 'Failed to select manga',
      };
    }
    case SELECT_MANGA: {
      const { mangaTitle } = action.payload;
      return {
        ...state,
        selectedManga: mangaTitle,
      };
    }
    case REVERSE_CHAPTERS: {
      const { mangaTitle } = action.payload;
      const mangaDetail = state.mangaDetailsByTitle[mangaTitle];
      return {
        ...state,
        mangaDetailsByTitle: {
          ...state.mangaDetailsByTitle,
          [mangaTitle]: {
            ...mangaDetail,
            chapterRefs: [...mangaDetail.chapterRefs.reverse()],
          },
        },
      };
    }
    default:
      return state;
  }
};

export default select;
