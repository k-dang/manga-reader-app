import {
  SAVE_TO_LIBRARY_REQUEST,
  SAVE_TO_LIBRARY_SUCCESS,
  SAVE_TO_LIBRARY_FAILURE,
  LOAD_LIBRARY_REQUEST,
  LOAD_LIBRARY_SUCCESS,
  LOAD_LIBRARY_FAILURE,
  REMOVE_FROM_LIBRARY_REQUEST,
  REMOVE_FROM_LIBRARY_SUCCESS,
  REMOVE_FROM_LIBRARY_FAILURE,
  SET_SORT_TYPE,
} from './constants';

// mangaById is a dictionary of
// {
//   id: {
//     title,
//     imageUrl
//   }
// }
const initialState = {
  status: 'idle',
  saveToError: null,
  loadError: null,
  removeFromError: null,
  mangaById: {},
  sortType: '',
};
const library = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_TO_LIBRARY_REQUEST: {
      const { id } = action.payload;
      return {
        ...state,
        status: 'pending',
        saveToError: null,
        mangaById: {
          ...state.mangaById,
          [id]: {},
        },
      };
    }
    case SAVE_TO_LIBRARY_SUCCESS: {
      const { id, title, imageUrl } = action.payload;
      return {
        ...state,
        status: 'resolved',
        mangaById: {
          ...state.mangaById,
          [id]: {
            title,
            imageUrl,
          },
        },
      };
    }
    case SAVE_TO_LIBRARY_FAILURE: {
      return {
        ...state,
        status: 'rejected',
        saveToError: 'Failed to save to library',
      };
    }
    case LOAD_LIBRARY_REQUEST: {
      return {
        ...state,
        status: 'pending',
        loadError: null,
      };
    }
    case LOAD_LIBRARY_SUCCESS: {
      const { libraryResult } = action.payload;
      return {
        ...state,
        status: 'resolved',
        mangaById: libraryResult.reduce((map, obj) => {
          map[obj.id] = { ...obj };
          return map;
        }, {}),
      };
    }
    case LOAD_LIBRARY_FAILURE: {
      return {
        ...state,
        status: 'rejected',
        loadError: 'Failed to load library',
      };
    }
    case REMOVE_FROM_LIBRARY_REQUEST: {
      return {
        ...state,
        status: 'pending',
        removeFromError: null,
      };
    }
    case REMOVE_FROM_LIBRARY_SUCCESS: {
      const { mangaId } = action.payload;
      const { [mangaId]: value, ...removed } = state.mangaById;
      return {
        ...state,
        status: 'resolved',
        mangaById: removed,
      };
    }
    case REMOVE_FROM_LIBRARY_FAILURE: {
      return {
        ...state,
        status: 'rejected',
        removeFromError: 'Failed to remove from library',
      };
    }
    case SET_SORT_TYPE: {
      const { type } = action.payload;
      return {
        ...state,
        sortType: type,
      };
    }
    default:
      return state;
  }
};

export default library;
