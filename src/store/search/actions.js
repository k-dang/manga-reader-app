import {
  SEARCH_MANGA_REQUEST,
  SEARCH_MANGA_SUCCESS,
  SEARCH_MANGA_FAILURE,
  SEARCH_MANGA_PAGINATED_SUCCESS,
  SET_SEARCH_SOURCE,
  sources,
  SEARCH_MANGA_DEX_SUCCESS,
  SEARCH_MANGA_DEX_PAGINATED_SUCCESS,
} from './constants';
import manganelo from '../../api/mangangelo';
import manganato from '../../api/manganato';
import {
  parseManganeloSearch,
  parseManganatoSearch,
} from '../../services/parseSearch';
import { getSearchResults } from '../../services/mangadexService';

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
  return async (dispatch, getState) => {
    dispatch(searchMangaRequest(searchTerm));
    try {
      const source = getState().search.searchSource;

      switch (source) {
        case sources.MANGADEX: {
          const [results, totalResults] = await getSearchResults(searchTerm);
          dispatch(searchMangaDexSuccess(results, totalResults));
          break;
        }
        case sources.MANGANATO:
        default: {
          const searchSafeString = searchTerm.replace(/\s/, '_');
          const response = await manganato.get(
            `/search/story/${searchSafeString}`
          );
          const [results, totalPages] = parseManganatoSearch(response.data);
          dispatch(searchMangaSuccess(results, totalPages));
        }
      }
    } catch (err) {
      console.log(err);
      dispatch(searchMangaFailure());
    }
  };
};

export const searchMangaPaginatedSuccess = (
  additionalResults,
  loadedPages
) => ({
  type: SEARCH_MANGA_PAGINATED_SUCCESS,
  payload: {
    additionalResults,
    loadedPages,
  },
});

export const searchMangaPaginated = (searchTerm) => {
  return async (dispatch, getState) => {
    try {
      const source = getState().search.searchSource;

      switch (source) {
        case sources.MANGADEX: {
          // offset should be length of current results
          const currentResultsLength = getState().search.loadedResults;
          const [results, totalResults] = await getSearchResults(
            searchTerm,
            currentResultsLength
          );
          dispatch(searchMangaDexPaginatedSuccess(results));
          break;
        }
        case sources.MANGANATO:
        default: {
          const searchSafeString = searchTerm.replace(/\s/, '_');
          const pageToLoad = getState().search.loadedPages + 1;
          const response = await manganato.get(
            `/search/story/${searchSafeString}?page=${pageToLoad}`
          );
          const [results, totalPages] = parseManganatoSearch(response.data);

          dispatch(searchMangaPaginatedSuccess(results, pageToLoad));
        }
      }
    } catch (err) {}
  };
};

export const setSearchSource = (source) => ({
  type: SET_SEARCH_SOURCE,
  payload: {
    source,
  },
});

export const searchMangaDexSuccess = (results, totalResults) => ({
  type: SEARCH_MANGA_DEX_SUCCESS,
  payload: {
    results,
    totalResults,
  },
});

export const searchMangaDexPaginatedSuccess = (additionalResults) => ({
  type: SEARCH_MANGA_DEX_PAGINATED_SUCCESS,
  payload: {
    additionalResults,
  },
});
