export const getChaptersState = (store) => store.chapters;

export const getChaptersFetchState = (store) =>
  getChaptersState(store) ? getChaptersState(store).isFetching : false;

export const getChaptersError = (store) =>
  getChaptersState(store) ? getChaptersState(store).error : null;

export const getChapterByRef = (store, chapterRef) =>
  getChaptersState(store)
    ? getChaptersState(store).chaptersByChapterRefs[chapterRef]
    : {};

export const getCurrentChapterRefIndex = (store) =>
  getChaptersState(store) ? getChaptersState(store).currentChapterRefIndex : 0;

export const getCurrentChapterRef = (store) =>
  getChaptersState(store) ? getChaptersState(store).currentChapterRef : '';
