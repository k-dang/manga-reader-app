export const getSelectState = (store) => store.select;

export const getSelectedMangaId = (store) =>
  getSelectState(store) ? getSelectState(store).selectedMangaId : '';

export const getSelectFetchState = (store) =>
  getSelectState(store) ? getSelectState(store).isFetching : false;

export const getMangaById = (store, mangaId) =>
  getSelectState(store)
    ? { ...getSelectState(store).mangaDetailsById[mangaId], mangaId }
    : {};

export const getSelectError = (store) =>
  getSelectState(store) ? getSelectState(store).error : null;
