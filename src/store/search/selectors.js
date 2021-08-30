export const getSearchState = (store) => store.search;

export const getSearchTerm = (store) =>
  getSearchState(store) ? getSearchState(store).searchTerm : '';

export const getSearchFetchStatus = (store) => getSearchState(store) ? getSearchState(store).status : 'idle';

export const getSearchResults = (store) =>
  getSearchState(store) ? getSearchState(store).results : [];

export const getSearchError = (store) =>
  getSearchState(store) ? getSearchState(store).errorMessage : '';

export const getSearchTotalPages = (store) =>
  getSearchState(store) ? getSearchState(store).totalPages : 0;

export const getSearchLoadedPages = (store) =>
  getSearchState(store) ? getSearchState(store).loadedPages : 0;
