import {
  FETCH_CHAPTER_REQUEST,
  FETCH_CHAPTER_SUCCESS,
  FETCH_CHAPTER_FAILURE,
  VIEW_CHAPTER,
  LOAD_CHAPTER_UPDATES,
  SET_CHAPTER_UPDATE,
} from './constants';

// chaptersByChapterRefs is dictionary of
// chapterRef: [{
//   url: ''
// }]
const initialState = {
  isFetching: false,
  error: null,
  currentChapterRef: '',
  currentChapterRefIndex: 0,
  chaptersByChapterRefs: {},
  chapterUpdatesByMangaId: {},
};
const chapters = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CHAPTER_REQUEST: {
      const { chapterRef, chapterRefIndex } = action.payload;
      return {
        ...state,
        isFetching: true,
        error: null,
        currentChapterRef: chapterRef,
        currentChapterRefIndex: chapterRefIndex,
      };
    }
    case FETCH_CHAPTER_SUCCESS: {
      const { chapterRef, imagesResult } = action.payload;
      return {
        ...state,
        isFetching: false,
        chaptersByChapterRefs: {
          ...state.chaptersByChapterRefs,
          [chapterRef]: imagesResult,
        },
      };
    }
    case FETCH_CHAPTER_FAILURE: {
      return {
        ...state,
        isFetching: false,
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
    default:
      return state;
  }
};

export default chapters;