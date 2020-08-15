export const getDiscoverState = (store) => store.discover;

export const getDiscoverLoadingStatus = (store) =>
  getDiscoverState(store) ? getDiscoverState(store).status : 'idle';

export const getDiscoverError = (store) =>
  getDiscoverState(store) ? getDiscoverState(store).errorMessage : null;

export const getDiscoverResults = (store) =>
  getDiscoverState(store) ? getDiscoverState(store).allResults : {};
