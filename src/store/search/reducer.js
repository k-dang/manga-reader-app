import {
  SEARCH_MANGA_REQUEST,
  SEARCH_MANGA_SUCCESS,
  SEARCH_MANGA_FAILURE,
  SEARCH_MANGA_PAGINATED_SUCCESS,
  sources,
  SET_SEARCH_SOURCE,
  SEARCH_MANGA_DEX_SUCCESS,
  SEARCH_MANGA_DEX_PAGINATED_SUCCESS,
} from './constants';

// results is array of
// Object {
//   "id": "az918766",
//   "imageUrl": "https://avt.mkklcdnv6.com/7/m/18-1583497374.jpg",
//   "title": "Ice Guy and the Cool Female Colleague",
//   "source": ""
// }
const initialState = {
  status: 'idle',
  errorMessage: '',
  searchTerm: '',
  results: [],
  loadedPages: 0,
  totalPages: 0,
  searchSource: sources.MANGANATO, // default source
  loadedResults: 0,
  totalResults: 0,
};
const search = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_MANGA_REQUEST: {
      const { searchTerm } = action.payload;
      return {
        ...state,
        status: 'pending',
        searchTerm: searchTerm,
        errorMessage: '',
        loadedPages: 0,
        totalPages: 0,
        loadedResults: 0,
        totalResults: 0,
      };
    }
    case SEARCH_MANGA_SUCCESS: {
      const { results, totalPages } = action.payload;
      return {
        ...state,
        status: 'resolved',
        results: results,
        loadedPages: 1,
        totalPages: totalPages,
      };
    }
    case SEARCH_MANGA_FAILURE: {
      return {
        ...state,
        status: 'rejected',
        errorMessage: 'Oh no, there was a problem finding manga',
      };
    }
    case SEARCH_MANGA_PAGINATED_SUCCESS: {
      const { additionalResults, loadedPages } = action.payload;
      return {
        ...state,
        results: [...state.results, ...additionalResults],
        loadedPages: loadedPages,
      };
    }
    case SET_SEARCH_SOURCE: {
      const { source } = action.payload;
      return {
        ...state,
        searchSource: source,
      };
    }
    case SEARCH_MANGA_DEX_SUCCESS: {
      const { results, totalResults } = action.payload;
      return {
        ...state,
        status: 'resolved',
        results: results,
        loadedResults: results.length,
        totalResults: totalResults,
      };
    }
    case SEARCH_MANGA_DEX_PAGINATED_SUCCESS: {
      const { additionalResults } = action.payload;
      return {
        ...state,
        results: [...state.results, ...additionalResults],
        loadedResults: state.loadedResults + additionalResults.length,
      };
    }
    default:
      return state;
  }
};

export default search;
