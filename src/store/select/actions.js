import {
  SELECT_MANGA_REQUEST,
  SELECT_MANGA_SUCCESS,
  SELECT_MANGA_FAILURE,
  SELECT_MANGA,
  REVERSE_CHAPTERS,
} from './constants';
import manganelo from '../../api/mangangelo';
import { parseManganeloSelect } from '../../services/parseSelect';

export const selectMangaRequest = (mangaTitle) => ({
  type: SELECT_MANGA_REQUEST,
  payload: {
    mangaTitle,
  },
});

export const selectMangaSuccess = (mangaTitle, result) => ({
  type: SELECT_MANGA_SUCCESS,
  payload: {
    mangaTitle,
    result,
  },
});

export const selectMangaFailure = () => ({
  type: SELECT_MANGA_FAILURE,
});

export const selectManga = (mangaTitle) => ({
  type: SELECT_MANGA,
  payload: {
    mangaTitle,
  },
});

const selectMangaFetch = (mangaTitle, mangaId) => {
  return async (dispatch) => {
    dispatch(selectMangaRequest(mangaTitle));
    try {
      const response = await manganelo.get(`/manga/${mangaId}`);
      const result = parseManganeloSelect(response.data);

      if (isMangaFetchResultValid(result)) {
        dispatch(selectMangaSuccess(mangaTitle, result));
      } else {
        dispatch(selectMangaFailure());
      }
    } catch (err) {
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

const shouldFetchSelectManga = (state, title) => {
  const manga = state.select.mangaDetailsByTitle[title];
  if (!manga) {
    return true;
  } else {
    return manga.didInvalidate;
  }
};

export const selectMangaFetchIfNeeded = (mangaTitle, mangaId) => {
  return (dispatch, getState) => {
    if (shouldFetchSelectManga(getState(), mangaTitle)) {
      return dispatch(selectMangaFetch(mangaTitle, mangaId));
    } else {
      return dispatch(selectManga(mangaTitle));
    }
  };
};

export const reverseChapters = (mangaTitle) => ({
  type: REVERSE_CHAPTERS,
  payload: {
    mangaTitle,
  },
});
