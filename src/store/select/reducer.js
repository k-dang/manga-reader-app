import {
  SELECT_MANGA_REQUEST,
  SELECT_MANGA_SUCCESS,
  SELECT_MANGA_FAILURE,
  SELECT_MANGA,
  REVERSE_CHAPTERS,
  MARK_CHAPTER_READ,
  MARK_CHAPTERS_READ,
  SELECT_MULTIPLE_MANGA_REQUEST,
  SELECT_MULTIPLE_MANGA_SUCCESS,
  SELECT_MULTIPLE_MANGA_FAILURE
} from './constants';

// mangaDetailsById is a dictionary of
// mangaId : {
//   mangaTitle: ''
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
  selectedMangaId: '',
  mangaDetailsById: {},
};
const select = (state = initialState, action) => {
  switch (action.type) {
    case SELECT_MANGA_REQUEST: {
      const { mangaId } = action.payload;
      return {
        ...state,
        isFetching: true,
        error: null,
        selectedMangaId: mangaId,
      };
    }
    case SELECT_MANGA_SUCCESS: {
      const { mangaId, result } = action.payload;
      return {
        ...state,
        isFetching: false,
        mangaDetailsById: {
          ...state.mangaDetailsById,
          [mangaId]: { ...result, didInvalidate: false },
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
      const { mangaId } = action.payload;
      return {
        ...state,
        selectedMangaId: mangaId,
      };
    }
    case REVERSE_CHAPTERS: {
      const { mangaId } = action.payload;
      const mangaDetail = state.mangaDetailsById[mangaId];
      return {
        ...state,
        mangaDetailsById: {
          ...state.mangaDetailsById,
          [mangaId]: {
            ...mangaDetail,
            chapterRefs: [...mangaDetail.chapterRefs.reverse()],
          },
        },
      };
    }
    case MARK_CHAPTER_READ: {
      const { mangaId, chapterRefIndex } = action.payload;
      const mangaDetail = state.mangaDetailsById[mangaId];
      return {
        ...state,
        mangaDetailsById: {
          ...state.mangaDetailsById,
          [mangaId]: {
            ...mangaDetail,
            chapterRefs: mangaDetail.chapterRefs.map((chapterRef, i) => {
              if (i !== chapterRefIndex) {
                return chapterRef;
              }
              return { ...chapterRef, hasRead: true };
            }),
          },
        },
      };
    }
    case MARK_CHAPTERS_READ: {
      const { mangaId, index } = action.payload;
      const mangaDetail = state.mangaDetailsById[mangaId];
      return {
        ...state,
        mangaDetailsById: {
          ...state.mangaDetailsById,
          [mangaId]: {
            ...mangaDetail,
            chapterRefs: mangaDetail.chapterRefs.map((chapterRef, i) => {
              if (i >= index) {
                return { ...chapterRef, hasRead: true };
              }
              return chapterRef;
            }),
          },
        },
      };
    }
    case SELECT_MULTIPLE_MANGA_SUCCESS: {
      const { results } = action.payload;
      return {
        ...state,
        mangaDetailsById: results.reduce((map, obj) => {
          map[obj.mangaId] = { ...obj };
          return map;
        }, {}),
      };
    }
    default:
      return state;
  }
};

export default select;
