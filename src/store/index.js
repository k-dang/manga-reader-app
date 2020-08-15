import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';

// reducers
import search from './search/reducer';
import select from './select/reducer';
import chapters from './chapters/reducer';
import account from './account/reducer';
import library from './library/reducer';
import discover from './discover/reducer';

const middlewares = [];
middlewares.push(thunkMiddleware);

if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger);
}

const rootReducer = combineReducers({
  search,
  select,
  chapters,
  account,
  library,
  discover,
});

export default createStore(rootReducer, applyMiddleware(...middlewares));
