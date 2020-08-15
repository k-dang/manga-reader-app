import {
  DISCOVER_MANGA_REQUEST,
  DISCOVER_MANGA_SUCCESS,
  DISCOVER_MANGA_FAILURE,
  DISCOVER_MANGA_PAGINATED_SUCCESS,
} from './constants';

// allResults is an object
// allResults : {
//   hot: {
//     results: [],
//     loadedPages: 0,
//     totalPages: 0
//   }
// }
const initialState = {
  status: 'idle',
  errorMessage: null,
  allResults: {},
};
const discover = (state = initialState, action) => {
  switch (action.type) {
    case DISCOVER_MANGA_REQUEST: {
      return {
        ...state,
        status: 'pending',
      };
    }
    case DISCOVER_MANGA_SUCCESS: {
      const { allResults } = action.payload;
      return {
        ...state,
        status: 'resolved',
        allResults,
      };
    }
    case DISCOVER_MANGA_FAILURE: {
      return {
        ...state,
        status: 'rejected',
        errorMessage: 'Failed to query',
      };
    }
    case DISCOVER_MANGA_PAGINATED_SUCCESS: {
      const { genre, additionalResults, loadedPages } = action.payload;
      const genreResults = state.allResults[genre];
      return {
        ...state,
        allResults: {
          ...state.allResults,
          [genre]: {
            ...genreResults,
            results: [...genreResults.results, ...additionalResults],
            loadedPages: loadedPages,
          },
        },
      };
    }
    default:
      return state;
  }
};

export default discover;
