import { sources } from './constants';

export const getSearchState = (store) => store.search;

export const getSearchTerm = (store) =>
  getSearchState(store) ? getSearchState(store).searchTerm : '';

export const getSearchFetchStatus = (store) =>
  getSearchState(store) ? getSearchState(store).status : 'idle';

export const getSearchResults = (store) =>
  getSearchState(store) ? getSearchState(store).results : [];

export const getSearchError = (store) =>
  getSearchState(store) ? getSearchState(store).errorMessage : '';

export const getSearchTotalPages = (store) =>
  getSearchState(store) ? getSearchState(store).totalPages : 0;

export const getSearchLoadedPages = (store) =>
  getSearchState(store) ? getSearchState(store).loadedPages : 0;

export const getSearchSource = (store) =>
  getSearchState(store)
    ? getSearchState(store).searchSource
    : sources.MANGANATO;

export const getSearchLoadedResults = (store) =>
  getSearchState(store) ? getSearchState(store).loadedResults : 0;

export const getSearchTotalResults = (store) =>
  getSearchState(store) ? getSearchState(store).totalResults : 0;
