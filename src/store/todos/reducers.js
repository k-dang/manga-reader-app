import {
  ADD_TODO,
  TOGGLE_TODO,
  SET_VISIBILITY_FILTER,
  VisibilityFilters,
} from './actions';
import { combineReducers } from 'redux';

const { SHOW_ALL } = VisibilityFilters;

const vfInitialState = SHOW_ALL;
export const visibilityFilter = (state = vfInitialState, action) => {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.payload.filter;
    default:
      return state;
  }
};

const todosInitialState = {
  allIds: [],
  byIds: {},
};
export const todos = (state = todosInitialState, action) => {
  switch (action.type) {
    case ADD_TODO: {
      const { id, text } = action.payload;
      return {
        ...state,
        allIds: [...state.allIds, id],
        byIds: {
          ...state.byIds,
          [id]: {
            text: text,
            completed: false,
          },
        },
      };
    }
    case TOGGLE_TODO: {
      const { id } = action.payload;
      return {
        ...state,
        byIds: {
          ...state.byIds,
          [id]: {
            ...state.byIds[id],
            completed: !state.byIds[id].completed,
          },
        },
      };
    }
    default:
      return state;
  }
};

// const todoApp = combineReducers({
//   visibilityFilter,
//   todos,
// });

// export default todoApp;
