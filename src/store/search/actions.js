import {
  SEARCH_MANGA_REQUEST,
  SEARCH_MANGA_SUCCESS,
  SEARCH_MANGA_FAILURE,
  SEARCH_MANGA_PAGINATED_SUCCESS,
} from './constants';
import manganelo from '../../api/mangangelo';
import { parseManganeloSearch } from '../../services/parseSearch';

export const searchMangaRequest = (searchTerm) => ({
  type: SEARCH_MANGA_REQUEST,
  payload: {
    searchTerm,
  },
});

export const searchMangaSuccess = (results, totalPages) => ({
  type: SEARCH_MANGA_SUCCESS,
  payload: {
    results,
    totalPages,
  },
});

export const searchMangaFailure = () => ({
  type: SEARCH_MANGA_FAILURE,
});

export const searchManga = (searchTerm) => {
  return async (dispatch) => {
    dispatch(searchMangaRequest(searchTerm));
    try {
      // support different sources here
      const searchSafeString = searchTerm.replace(/\s/, '_');
      const response = await manganelo.get(`/search/story/${searchSafeString}`);
      const [results, totalPages] = parseManganeloSearch(response.data);

      dispatch(searchMangaSuccess(results, totalPages));
    } catch (err) {
      console.log(err);
      dispatch(searchMangaFailure());
    }
  };
};

export const searchMangaPaginatedSuccess = (additionalResults, loadedPages) => ({
  type: SEARCH_MANGA_PAGINATED_SUCCESS,
  payload: {
    additionalResults,
    loadedPages,
  },
});

export const searchMangaPaginated = (searchTerm, page) => {
  return async (dispatch) => {
    try {
      // support different sources here
      const searchSafeString = searchTerm.replace(/\s/, '_');
      const response = await manganelo.get(
        `/search/story/${searchSafeString}?page=${page}`
      );
      const [results, totalPages] = parseManganeloSearch(response.data);

      dispatch(searchMangaPaginatedSuccess(results, page));
    } catch (err) {}
  };
};
