// action types
export const ADD_TODO = 'ADD_TODO';
export const TOGGLE_TODO = 'TOGGLE_TODO';
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER';

// other constants
export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE',
};

let nextTodoId = 0;

// action creators
export const addTodo = (text) => ({
  type: ADD_TODO,
  payload: { id: ++nextTodoId, text },
});

export const toggleTodo = (index) => ({
  type: TOGGLE_TODO,
  payload: {
    index,
  },
});

export const setFilter = (filter) => ({
  type: SET_VISIBILITY_FILTER,
  payload: { filter },
});
