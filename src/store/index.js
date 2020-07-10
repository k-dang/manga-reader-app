import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import search from './search/reducer';
import select from './select/reducer';
import chapters from './chapters/reducer';
import { visibilityFilter, todos } from './todos/reducers';
import logger from 'redux-logger';

const rootReducer = combineReducers({
  todos,
  visibilityFilter,
  search,
  select,
  chapters,
});

export default createStore(
  rootReducer,
  applyMiddleware(thunkMiddleware, logger)
);
