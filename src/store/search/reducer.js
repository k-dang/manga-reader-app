import {
  SEARCH_MANGA_REQUEST,
  SEARCH_MANGA_SUCCESS,
  SEARCH_MANGA_FAILURE,
  SEARCH_MANGA_PAGINATED_SUCCESS,
} from './constants';

// results is array of
// Object {
//   "id": "az918766",
//   "imageUrl": "https://avt.mkklcdnv6.com/7/m/18-1583497374.jpg",
//   "title": "Ice Guy and the Cool Female Colleague",
// }
const initialState = {
  isFetching: false,
  errorMessage: '',
  searchTerm: '',
  results: [],
  loadedPages: 0,
  totalPages: 0,
};
const search = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_MANGA_REQUEST: {
      const { searchTerm } = action.payload;
      return {
        ...state,
        isFetching: true,
        searchTerm: searchTerm,
        errorMessage: '',
        loadedPages: 0,
        totalPages: 0,
      };
    }
    case SEARCH_MANGA_SUCCESS: {
      const { results, totalPages } = action.payload;
      return {
        ...state,
        isFetching: false,
        results: results,
        loadedPages: 1,
        totalPages: totalPages,
      };
    }
    case SEARCH_MANGA_FAILURE: {
      return {
        ...state,
        isFetching: false,
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
    default:
      return state;
  }
};

export default search;
