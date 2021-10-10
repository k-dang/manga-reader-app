export const getChaptersState = (store) => store.chapters;

export const getChaptersFetchStatus = (store) =>
  getChaptersState(store) ? getChaptersState(store).status : 'idle';

export const getChaptersError = (store) =>
  getChaptersState(store) ? getChaptersState(store).error : null;

export const getChaptersByMangaId = (store, mangaId) =>
  getChaptersState(store)
    ? getChaptersState(store).chaptersByMangaId[mangaId]
    : {};

export const getCurrentChapterRefIndex = (store) =>
  getChaptersState(store) ? getChaptersState(store).currentChapterRefIndex : 0;

export const getCurrentChapterRef = (store) =>
  getChaptersState(store) ? getChaptersState(store).currentChapterRef : '';

export const getChapterTotals = (store) =>
  getChaptersState(store)
    ? getChaptersState(store).chapterUpdatesByMangaId
    : {};
