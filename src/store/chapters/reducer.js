import {
  FETCH_CHAPTER_REQUEST,
  FETCH_CHAPTER_SUCCESS,
  FETCH_CHAPTER_FAILURE,
  VIEW_CHAPTER,
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
        currentChapterRef: chapterRef,
        currentChapterRefIndex: chapterRefIndex,
      };
    }
    default:
      return state;
  }
};

export default chapters;
