import {
  FETCH_CHAPTER_REQUEST,
  FETCH_CHAPTER_SUCCESS,
  FETCH_CHAPTER_FAILURE,
  VIEW_CHAPTER,
} from './constants';
import manganelo from '../../api/mangangelo';
import { parseManganeloChapter } from '../../services/parseChapter';

export const fetchChapterRequest = (chapterRef, chapterRefIndex) => ({
  type: FETCH_CHAPTER_REQUEST,
  payload: {
    chapterRef,
    chapterRefIndex,
  },
});

export const fetchChapterSuccess = (chapterRef, imagesResult) => ({
  type: FETCH_CHAPTER_SUCCESS,
  payload: {
    chapterRef,
    imagesResult,
  },
});

export const fetchChapterFailure = () => ({
  type: FETCH_CHAPTER_FAILURE,
});

export const viewChapter = (chapterRef, chapterRefIndex) => ({
  type: VIEW_CHAPTER,
  payload: {
    chapterRef,
    chapterRefIndex,
  },
});

const fetchChapter = (chapterRef, chapterRefIndex) => {
  return async (dispatch) => {
    dispatch(fetchChapterRequest(chapterRef, chapterRefIndex));
    try {
      const response = await manganelo.get(`/chapter/${chapterRef}`);
      const results = parseManganeloChapter(response.data);

      dispatch(fetchChapterSuccess(chapterRef, results));
    } catch (err) {
      console.log(err)
      dispatch(fetchChapterFailure());
    }
  };
};

const shouldFetchChapter = (state, chapterRef) => {
  const chapter = state.chapters.chaptersByChapterRefs[chapterRef];
  if (!chapter) {
    return true;
  } else {
    return false;
  }
};

export const fetchChapterIfNeeded = (chapterRef, chapterRefIndex) => {
  return (dispatch, getState) => {
    if (shouldFetchChapter(getState(), chapterRef)) {
      return dispatch(fetchChapter(chapterRef, chapterRefIndex));
    } else {
      return dispatch(viewChapter(chapterRef, chapterRefIndex));
    }
  };
};
