export const getSearchState = (store) => store.search;

export const getSearchTerm = (store) =>
  getSearchState(store) ? getSearchState(store).searchTerm : '';

export const getFetchState = (store) =>
  getSearchState(store) ? getSearchState(store).isFetching : false;

export const getSearchResults = (store) =>
  getSearchState(store) ? getSearchState(store).results : [];

export const getSearchError = (store) =>
  getSearchState(store) ? getSearchState(store).errorMessage : '';

export const getSearchTotalPages = (store) =>
  getSearchState(store) ? getSearchState(store).totalPages : 0;

export const getSearchLoadedPages = (store) =>
  getSearchState(store) ? getSearchState(store).loadedPages : 0;
