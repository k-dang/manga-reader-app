import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import search from './search/reducer';
import select from './select/reducer';
import chapters from './chapters/reducer';
import account from './account/reducer';
import library from './library/reducer';
import logger from 'redux-logger';

const rootReducer = combineReducers({
  search,
  select,
  chapters,
  account,
  library,
});

export default createStore(
  rootReducer,
  applyMiddleware(thunkMiddleware, logger)
);
