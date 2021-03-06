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
  SET_CHAPTER_PAGE_READ,
} from './constants';
import manganelo from '../../api/mangangelo';
import manganato from '../../api/manganato';
import {
  parseManganeloSelect,
  parseManganatoSelect,
} from '../../services/parseSelect';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPageItemAsyncStorage } from '../../services/asyncStorageHelpers';
import {
  decrementChapterUpdate,
  syncChapterUpdate,
  syncAllChapterUpdates,
} from '../chapters/actions';

export const selectMangaRequest = (mangaId) => ({
  type: SELECT_MANGA_REQUEST,
  payload: {
    mangaId,
  },
});

export const selectMangaSuccess = (mangaId, result) => ({
  type: SELECT_MANGA_SUCCESS,
  payload: {
    mangaId,
    result,
  },
});

export const selectMangaFailure = () => ({
  type: SELECT_MANGA_FAILURE,
});

export const selectManga = (mangaId) => ({
  type: SELECT_MANGA,
  payload: {
    mangaId,
  },
});

/**
 * fetches manga detail & merges data from async storage
 * @param {string} mangaId - id of manga from manganato
 * @param {string} mangaTitle - title of manga
 */
const selectMangaFetch = (mangaId, mangaTitle) => {
  return async (dispatch) => {
    dispatch(selectMangaRequest(mangaId));
    try {
      const response = await manganato.get(`/${mangaId}`);
      const result = parseManganatoSelect(response.data);

      if (isMangaFetchResultValid(result)) {
        // get from async storage and merge everytime fetch successful
        const value = await AsyncStorage.getItem(mangaId);
        const jsonValue = value ? JSON.parse(value) : {};
        result.chapterRefs = result.chapterRefs.map((chapterRefObj) => {
          const key = chapterRefObj.chapterRef;
          if (jsonValue && jsonValue[key]) {
            chapterRefObj = { ...chapterRefObj, ...jsonValue[key] };
          }
          return chapterRefObj;
        });

        const pageItem = await getPageItemAsyncStorage(mangaId);
        if (pageItem != null) {
          result['latestChapterRead'] = pageItem[0];
          result['latestChapterPage'] = parseInt(pageItem[1]);
        }

        dispatch(selectMangaSuccess(mangaId, { ...result, mangaTitle }));
        dispatch(syncChapterUpdate(mangaId));
      } else {
        dispatch(selectMangaFailure());
      }
    } catch (err) {
      console.log(err);
      dispatch(selectMangaFailure());
    }
  };
};

const isMangaFetchResultValid = (result) => {
  return (
    result.chapterRefs.length > 0 &&
    result.cleanedDescription &&
    result.infoImageUrl &&
    result.lastChapter &&
    result.lastUpdated &&
    result.status
  );
};

const shouldFetchSelectManga = (state, mangaId) => {
  const manga = state.select.mangaDetailsById[mangaId];
  if (!manga) {
    return true;
  } else {
    return manga.didInvalidate;
  }
};

export const selectMangaFetchIfNeeded = (mangaId, mangaTitle) => {
  return (dispatch, getState) => {
    if (shouldFetchSelectManga(getState(), mangaId)) {
      return dispatch(selectMangaFetch(mangaId, mangaTitle));
    } else {
      return dispatch(selectManga(mangaId));
    }
  };
};

export const selectMultipleMangaRequest = () => ({
  type: SELECT_MULTIPLE_MANGA_REQUEST,
});

const selectMultipleMangaSuccess = (results) => ({
  type: SELECT_MULTIPLE_MANGA_SUCCESS,
  payload: {
    results,
  },
});

const selectMultipleMangaFailure = () => ({
  type: SELECT_MULTIPLE_MANGA_FAILURE,
});

/**
 * fetch select data for each manga in list
 * @param {array} manga - list of manga objects
 */
export const selectMultipleMangaFetch = (manga) => {
  return async (dispatch) => {
    dispatch(selectMultipleMangaRequest());
    try {
      const requests = [];
      for (const m of manga) {
        requests.push(manganato.get(`/${m.id}`));
      }
      const results = await Promise.all(requests);

      const parsedResults = [];
      for (const [index, result] of results.entries()) {
        const parsedResult = parseManganatoSelect(result.data);
        if (isMangaFetchResultValid(parsedResult)) {
          const value = await AsyncStorage.getItem(manga[index].id);
          const jsonValue = JSON.parse(value);
          parsedResult.chapterRefs = parsedResult.chapterRefs.map(
            (chapterRefObj) => {
              const key = chapterRefObj.chapterRef;
              if (jsonValue && jsonValue[key]) {
                chapterRefObj = { ...chapterRefObj, ...jsonValue[key] };
              }
              return chapterRefObj;
            }
          );
          parsedResult.mangaId = manga[index].id;
          parsedResults.push(parsedResult);
        }
      }
      dispatch(selectMultipleMangaSuccess(parsedResults));
      dispatch(syncAllChapterUpdates(parsedResults));
    } catch (err) {
      console.log(err);
      dispatch(selectMultipleMangaFailure());
    }
  };
};

export const reverseChapters = (mangaId) => ({
  type: REVERSE_CHAPTERS,
  payload: {
    mangaId,
  },
});

export const markChapterRead = (mangaId, chapterRefIndex) => ({
  type: MARK_CHAPTER_READ,
  payload: {
    mangaId,
    chapterRefIndex,
  },
});

/**
 * save chapter read to async storage, updates store and decrement chapter total
 * @param {string} mangaId - id of manga
 * @param {string} chapterRef - ref to specific chapter
 * @param {integer} chapterRefIndex - index of the ref
 */
const saveChapterRead = (mangaId, chapterRef, chapterRefIndex) => {
  return async (dispatch) => {
    try {
      const value = await AsyncStorage.getItem(mangaId);
      const chapterRefsToSave = value ? JSON.parse(value) : {};
      // TODO maybe save in a diff format if size becomes an issue
      chapterRefsToSave[chapterRef] = {
        hasRead: true,
      };
      await AsyncStorage.setItem(mangaId, JSON.stringify(chapterRefsToSave));
      dispatch(markChapterRead(mangaId, chapterRefIndex));
      dispatch(decrementChapterUpdate(mangaId));
    } catch (e) {
      console.log(e);
    }
  };
};

const shouldSaveChapterRead = (state, mangaId, chapterRefIndex) => {
  const manga = state.select.mangaDetailsById[mangaId];
  if (manga.chapterRefs[chapterRefIndex].hasRead) {
    return false;
  } else {
    return true;
  }
};

export const saveChapterReadIfNeeded = (
  mangaId,
  chapterRef,
  chapterRefIndex
) => {
  return (dispatch, getState) => {
    if (shouldSaveChapterRead(getState(), mangaId, chapterRefIndex)) {
      return dispatch(saveChapterRead(mangaId, chapterRef, chapterRefIndex));
    }
  };
};

export const markChaptersRead = (mangaId, index) => ({
  type: MARK_CHAPTERS_READ,
  payload: {
    mangaId,
    index,
  },
});

export const saveChaptersRead = (mangaId, index) => {
  return async (dispatch, getState) => {
    try {
      const value = await AsyncStorage.getItem(mangaId);
      const chapterRefsToSave = value ? JSON.parse(value) : {};

      const manga = getState().select.mangaDetailsById[mangaId];
      for (const chapterRefObj of manga.chapterRefs.slice(index)) {
        // TODO maybe save in a diff format if size becomes an issue
        chapterRefsToSave[chapterRefObj.chapterRef] = {
          hasRead: true,
        };
      }
      await AsyncStorage.setItem(mangaId, JSON.stringify(chapterRefsToSave));
      dispatch(markChaptersRead(mangaId, index));
      dispatch(syncChapterUpdate(mangaId));
    } catch (e) {
      console.log(e);
    }
  };
};

export const setChapterPageRead = (mangaId, chapterRef, page) => ({
  type: SET_CHAPTER_PAGE_READ,
  payload: {
    mangaId,
    chapterRef,
    page,
  },
});

export const saveChapterPageRead = (mangaId, chapterRef, page) => {
  return async (dispatch) => {
    try {
      // just upsert w/e
      await AsyncStorage.setItem(`${mangaId};page`, `${chapterRef};${page}`);
      dispatch(setChapterPageRead(mangaId, chapterRef, page));
    } catch (e) {
      console.log(e);
    }
  };
};
