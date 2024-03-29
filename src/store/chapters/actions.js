import {
  FETCH_CHAPTER_REQUEST,
  FETCH_CHAPTER_SUCCESS,
  FETCH_CHAPTER_FAILURE,
  VIEW_CHAPTER,
  LOAD_CHAPTER_UPDATES,
  SET_CHAPTER_UPDATE,
  SET_MULTIPLE_CHAPTER_UPDATE,
} from './constants';
import { sources } from '../search/constants';

import manganelo from '../../api/mangangelo';
import manganato from '../../api/manganato';
import {
  parseManganeloChapter,
  parseManganatoChapter,
} from '../../services/parseChapter';
import { getChapterImages } from '../../services/mangadexService';

// async storage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateTotalChaptersAsyncStorage } from '../../services/asyncStorageHelpers';

export const fetchChapterRequest = (chapterRef, chapterRefIndex) => ({
  type: FETCH_CHAPTER_REQUEST,
  payload: {
    chapterRef,
    chapterRefIndex,
  },
});

export const fetchChapterSuccess = (chapterRef, imagesResult, mangaId) => ({
  type: FETCH_CHAPTER_SUCCESS,
  payload: {
    chapterRef,
    imagesResult,
    mangaId,
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

/**
 * fetch image urls for a chapter and store them in redux store
 * @param {string} mangaId - id of manga
 * @param {string} chapterRef - ref to specific chapter
 * @param {integer} chapterRefIndex - index of the ref
 * @param {string} source - source for chapter fetch
 * @returns
 */
const fetchChapter = (mangaId, chapterRef, chapterRefIndex, source) => {
  return async (dispatch) => {
    dispatch(fetchChapterRequest(chapterRef, chapterRefIndex));
    try {
      let results = null;
      switch (source) {
        case sources.MANGADEX: {
          results = await getChapterImages(chapterRef);
          break;
        }
        case sources.MANGANATO:
        default: {
          const response = await manganato.get(`/${mangaId}/${chapterRef}`);
          results = parseManganatoChapter(response.data);
        }
      }

      dispatch(fetchChapterSuccess(chapterRef, results, mangaId));
    } catch (err) {
      console.log(err);
      dispatch(fetchChapterFailure());
    }
  };
};

const shouldFetchChapter = (state, chapterRef) => {
  const chapters =
    state.chapters.chaptersByMangaId[state.select.selectedMangaId];
  // conditional access
  const chapter = chapters?.[chapterRef];
  if (!chapter) {
    return true;
  } else {
    return false;
  }
};

/**
 * dispatches fetchChapter if chapter data isn't already saved
 * @param {string} chapterRef - ref to specific chapter
 * @param {integer} chapterRefIndex - index of the ref
 * @param {string} source - source for chapter fetch
 * @returns
 */
export const fetchChapterIfNeeded = (chapterRef, chapterRefIndex, source) => {
  return (dispatch, getState) => {
    if (shouldFetchChapter(getState(), chapterRef)) {
      return dispatch(
        fetchChapter(
          getState().select.selectedMangaId,
          chapterRef,
          chapterRefIndex,
          source
        )
      );
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
    const chapterKeys = keys.filter(
      (key) => key != 'userId' && key != 'theme' && !key.includes('page')
    );
    const chapterUpdatesByMangaId = {};
    for (const key of chapterKeys) {
      // TODO: get items in parallel
      const value = JSON.parse(await AsyncStorage.getItem(key));
      // account for "totalChapters" key
      const readTotal = Object.keys(value).length - 1;
      // edge case where chapters get removed and we get more reads than total chapters?
      const totalRead =
        value.totalChapters - readTotal < 0
          ? 0
          : value.totalChapters - readTotal;
      chapterUpdatesByMangaId[key] = totalRead;
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

/**
 * upserts chapter totals from store to async storage
 * updates chapters left to read in store
 * @param {string} mangaId - id of manga from manganelo
 */
export const syncChapterUpdate = (mangaId) => {
  return async (dispatch, getState) => {
    if (getState().library.mangaById[mangaId]) {
      const mangaDetails = getState().select.mangaDetailsById[mangaId];
      const totalChapters = mangaDetails.chapterRefs.length;

      await updateTotalChaptersAsyncStorage(mangaId, totalChapters);
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

export const setMultipleChapterUpdate = (chapterUpdatesByMangaId) => ({
  type: SET_MULTIPLE_CHAPTER_UPDATE,
  payload: {
    chapterUpdatesByMangaId,
  },
});

/**
 * updates async storage with chapter totals & updates badges
 * @param {array} parsedResults - results of parsing list of mangaIds from source
 */
export const syncAllChapterUpdates = (parsedResults) => {
  return async (dispatch, getState) => {
    const chapterUpdates = {};
    for (const result of parsedResults) {
      await updateTotalChaptersAsyncStorage(
        result.mangaId,
        result.chapterRefs.length
      );
      const mangaDetails = getState().select.mangaDetailsById[result.mangaId];
      const leftOver = mangaDetails.chapterRefs.reduce((total, chapterRef) => {
        if (!chapterRef.hasRead) {
          return total + 1;
        } else {
          return total;
        }
      }, 0);

      chapterUpdates[result.mangaId] = leftOver;
    }

    dispatch(setMultipleChapterUpdate(chapterUpdates));
  };
};
