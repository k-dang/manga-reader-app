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
  SELECT_MULTIPLE_MANGA_FAILURE,
  SET_CHAPTER_PAGE_READ
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
//     next: ''
//     number: ''
//   }],
//   latestChapterRead: '',
//   latestChapterPage: '',
//   didInvalidate: '',
//   source: ''
// }
const initialState = {
  status: 'idle',
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
        status: 'pending',
        error: null,
        selectedMangaId: mangaId,
      };
    }
    case SELECT_MANGA_SUCCESS: {
      const { mangaId, result } = action.payload;
      return {
        ...state,
        status: 'resolved',
        mangaDetailsById: {
          ...state.mangaDetailsById,
          [mangaId]: { ...result, didInvalidate: false },
        },
      };
    }
    case SELECT_MANGA_FAILURE: {
      return {
        ...state,
        status: 'rejected',
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
    case SELECT_MULTIPLE_MANGA_REQUEST: {
      return {
        ...state,
        status: 'pending',
      };
    }
    case SELECT_MULTIPLE_MANGA_SUCCESS: {
      const { results } = action.payload;
      return {
        ...state,
        status: 'resolved',
        mangaDetailsById: results.reduce((map, obj) => {
          map[obj.mangaId] = { ...obj };
          return map;
        }, {}),
      };
    }
    case SELECT_MULTIPLE_MANGA_FAILURE: {
      return {
        ...state,
        status: 'rejected',
        error: 'Failed to select multiple manga',
      };
    }
    case SET_CHAPTER_PAGE_READ: {
      const { mangaId, chapterRef, page } = action.payload;
      const mangaDetail = state.mangaDetailsById[mangaId];
      return {
        ...state,
        mangaDetailsById: {
          ...state.mangaDetailsById,
          [mangaId]: {
            ...mangaDetail,
            latestChapterRead: chapterRef,
            latestChapterPage: page
          }
        }
      };
    }
    default:
      return state;
  }
};

export default select;
