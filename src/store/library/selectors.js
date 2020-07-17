export const getLibraryState = (store) => store.library;

export const getLibraryLoadingStatus = (store) =>
  getLibraryState(store) ? getLibraryState(store).status : false;

export const getMangaList = (store) => {
  if (getLibraryState(store)) {
    const mangaList = [];
    for (const [id, manga] of Object.entries(
      getLibraryState(store).mangaById
    )) {
      mangaList.push({ id, ...manga });
    }
    return mangaList;
  } else {
    return [];
  }
};

export const getLibraryMangaById = (store, mangaId) =>
  getLibraryState(store) ? getLibraryState(store).mangaById[mangaId] : {};

export const getLoadError = (store) =>
  getLibraryState(store) ? getLibraryState(store).loadError : null;
