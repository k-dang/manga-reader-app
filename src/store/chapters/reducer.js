import {
  FETCH_CHAPTER_REQUEST,
  FETCH_CHAPTER_SUCCESS,
  FETCH_CHAPTER_FAILURE,
  VIEW_CHAPTER,
  LOAD_CHAPTER_UPDATES,
  SET_CHAPTER_UPDATE,
  SET_MULTIPLE_CHAPTER_UPDATE,
} from './constants';

// chaptersByMangaId is dictionary of
// mangaId: { chapterRef: [{ url: '' }] }
// chaptersByMangaId: {}
// chapterUpdatesByMangaId is dictionary of
// mangaId: number
const initialState = {
  status: 'idle',
  error: null,
  currentChapterRef: '',
  currentChapterRefIndex: 0,
  chaptersByMangaId: {},
  chapterUpdatesByMangaId: {},
};
const chapters = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CHAPTER_REQUEST: {
      const { chapterRef, chapterRefIndex } = action.payload;
      return {
        ...state,
        status: 'pending',
        error: null,
        currentChapterRef: chapterRef,
        currentChapterRefIndex: chapterRefIndex,
      };
    }
    case FETCH_CHAPTER_SUCCESS: {
      const { chapterRef, imagesResult, mangaId } = action.payload;
      const mangaChapters = state.chaptersByMangaId[mangaId] ? state.chaptersByMangaId[mangaId] : {};
      return {
        ...state,
        status: 'resolved',
        chaptersByMangaId: {
          ...state.chaptersByMangaId,
          [mangaId]: {
            ...mangaChapters,
            [chapterRef]: imagesResult
          }
        }
      };
    }
    case FETCH_CHAPTER_FAILURE: {
      return {
        ...state,
        status: 'rejected',
        error: 'Oh no, there was a problem finding this chapter',
      };
    }
    case VIEW_CHAPTER: {
      const { chapterRef, chapterRefIndex } = action.payload;
      return {
        ...state,
        error: null,
        currentChapterRef: chapterRef,
        currentChapterRefIndex: chapterRefIndex,
      };
    }
    case LOAD_CHAPTER_UPDATES: {
      const { chapterUpdatesByMangaId } = action.payload;
      return {
        ...state,
        chapterUpdatesByMangaId,
      };
    }
    case SET_CHAPTER_UPDATE: {
      const { mangaId, chapterUpdates } = action.payload;
      return {
        ...state,
        chapterUpdatesByMangaId: {
          ...state.chapterUpdatesByMangaId,
          [mangaId]: chapterUpdates,
        },
      };
    }
    case SET_MULTIPLE_CHAPTER_UPDATE: {
      const { chapterUpdatesByMangaId } = action.payload;
      return {
        ...state,
        chapterUpdatesByMangaId,
      };
    }
    default:
      return state;
  }
};

export default chapters;
