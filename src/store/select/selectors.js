export const getSelectState = (store) => store.select;

export const getSelectedMangaId = (store) =>
  getSelectState(store) ? getSelectState(store).selectedMangaId : '';

export const getSelectFetchStatus = (store) =>
  getSelectState(store) ? getSelectState(store).status : 'idle';

export const getMangaById = (store, mangaId) =>
  getSelectState(store)
    ? { ...getSelectState(store).mangaDetailsById[mangaId], mangaId }
    : {};

export const getSelectError = (store) =>
  getSelectState(store) ? getSelectState(store).error : null;
