export const getSelectState = (store) => store.select;

export const getSelectedManga = (store) =>
  getSelectState(store) ? getSelectState(store).selectedManga : '';

export const getSelectFetchState = (store) =>
  getSelectState(store) ? getSelectState(store).isFetching : false;

export const getMangaByTitle = (store, title) =>
  getSelectState(store)
    ? { ...getSelectState(store).mangaDetailsByTitle[title], title }
    : {};

export const getSelectError = (store) =>
  getSelectState(store) ? getSelectState(store).error : null;
