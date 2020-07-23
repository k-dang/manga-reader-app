import {
  FETCH_CHAPTER_REQUEST,
  FETCH_CHAPTER_SUCCESS,
  FETCH_CHAPTER_FAILURE,
  VIEW_CHAPTER,
  LOAD_CHAPTER_UPDATES,
  SET_CHAPTER_UPDATE,
} from './constants';
import manganelo from '../../api/mangangelo';
import { parseManganeloChapter } from '../../services/parseChapter';
import AsyncStorage from '@react-native-community/async-storage';

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
      console.log(err);
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

const loadChapterTotals = (chapterUpdatesByMangaId) => ({
  type: LOAD_CHAPTER_UPDATES,
  payload: {
    chapterUpdatesByMangaId,
  },
});

export const loadChapterTotalsAsyncStorage = () => {
  return async (dispatch) => {
    const keys = await AsyncStorage.getAllKeys();
    const chapterKeys = keys.filter((key) => key != 'userId' && key != 'theme');
    const chapterUpdatesByMangaId = {};
    for (const key of chapterKeys) {
      const value = JSON.parse(await AsyncStorage.getItem(key));
      // account for "totalChapters" key
      const readTotal = Object.keys(value).length - 1;
      chapterUpdatesByMangaId[key] = value.totalChapters - readTotal;
    }

    dispatch(loadChapterTotals(chapterUpdatesByMangaId));
  };
};

export const setChapterUpdate = (mangaId, chapterUpdates) => ({
  type: SET_CHAPTER_UPDATE,
  payload: {
    mangaId,
    chapterUpdates,
  },
});

export const decrementChapterUpdate = (mangaId) => {
  return (dispatch, getState) => {
    const current = getState().chapters.chapterUpdatesByMangaId[mangaId];
    if (current > 0) {
      dispatch(setChapterUpdate(mangaId, current - 1));
    }
  };
};

export const syncChapterUpdate = (mangaId) => {
  return async (dispatch, getState) => {
    if (getState().library.mangaById[mangaId]) {
      const mangaDetails = getState().select.mangaDetailsById[mangaId];
      const totalChapters = mangaDetails.chapterRefs.length;
      const value = await AsyncStorage.getItem(mangaId);
      const jsonValue = value ? JSON.parse(value) : {};
      jsonValue.totalChapters = totalChapters;
      await AsyncStorage.setItem(mangaId, JSON.stringify(jsonValue));

      const leftOver = mangaDetails.chapterRefs.reduce((total, chapterRef) => {
        if (!chapterRef.hasRead) {
          return total + 1;
        } else {
          return total;
        }
      }, 0);
      dispatch(setChapterUpdate(mangaId, leftOver));
    }
  };
};
