import {
  DISCOVER_MANGA_REQUEST,
  DISCOVER_MANGA_SUCCESS,
  DISCOVER_MANGA_FAILURE,
  DISCOVER_MANGA_PAGINATED_SUCCESS,
} from './constants';
import manganelo from '../../api/mangangelo';
import manganato from '../../api/manganato';
import {
  parseManganeloAdvancedSearch,
  parseManganatoAdvancedSearch,
} from '../../services/parseSearch';
import { getGenreTopUrl } from '../../services/manganeloHelpers';

const discoverMangaRequest = () => ({
  type: DISCOVER_MANGA_REQUEST,
});

const discoverMangaSuccess = (allResults) => ({
  type: DISCOVER_MANGA_SUCCESS,
  payload: { allResults },
});

const discoverMangaFailure = () => ({
  type: DISCOVER_MANGA_FAILURE,
});

/**
 * get all top manga for genres specified
 * @param {array} genres - array of strings
 */
export const fetchDiscoverMangaGenres = (genres) => {
  return async (dispatch) => {
    dispatch(discoverMangaRequest());
    try {
      const requests = [];
      for (const genre of genres) {
        requests.push(manganato.get(getGenreTopUrl(genre)));
      }

      const allParsedResults = {};
      const results = await Promise.all(requests);
      for (const [index, result] of results.entries()) {
        const [results, totalPages] = parseManganatoAdvancedSearch(result.data);

        allParsedResults[genres[index]] = {
          results,
          loadedPages: 1,
          totalPages,
        };
      }

      dispatch(discoverMangaSuccess(allParsedResults));
    } catch (err) {
      dispatch(discoverMangaFailure());
    }
  };
};

export const discoverMangaPaginatedSuccess = (
  genre,
  additionalResults,
  loadedPages
) => ({
  type: DISCOVER_MANGA_PAGINATED_SUCCESS,
  payload: { genre, additionalResults, loadedPages },
});

export const fetchGenrePaginated = (genre) => {
  return async (dispatch, getState) => {
    try {
      const genreResult = getState().discover.allResults[genre];
      if (genreResult.loadedPages < genreResult.totalPages) {
        const pageToLoad = genreResult.loadedPages + 1;
        // console.log(getGenreTopUrl(genre) + `&page=${pageToLoad}`);

        const response = await manganato.get(
          getGenreTopUrl(genre) + `&page=${pageToLoad}`
        );
        const [results, totalPages] = parseManganatoAdvancedSearch(
          response.data
        );

        dispatch(discoverMangaPaginatedSuccess(genre, results, pageToLoad));
      }
    } catch (err) {}
  };
};
