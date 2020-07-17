import {
  SAVE_TO_LIBRARY_REQUEST,
  SAVE_TO_LIBRARY_SUCCESS,
  SAVE_TO_LIBRARY_FAILURE,
  LOAD_LIBRARY_REQUEST,
  LOAD_LIBRARY_SUCCESS,
  LOAD_LIBRARY_FAILURE,
  REMOVE_FROM_LIBRARY_REQUEST,
  REMOVE_FROM_LIBRARY_SUCCESS,
  REMOVE_FROM_LIBRARY_FAILURE,
} from './constants';
import cloudfunction from '../../api/cloudfunction';
import { selectMultipleMangaFetch } from '../select/actions';
import { syncChapterUpdate } from '../chapters/actions';

export const saveToLibraryRequest = (id) => ({
  type: SAVE_TO_LIBRARY_REQUEST,
  payload: { id },
});

export const saveToLibrarySuccess = (id, title, imageUrl) => ({
  type: SAVE_TO_LIBRARY_SUCCESS,
  payload: { id, title, imageUrl },
});

export const saveToLibraryFailure = () => ({
  type: SAVE_TO_LIBRARY_FAILURE,
});

export const saveToLibrary = (id, title, imageUrl, userId) => {
  return async (dispatch) => {
    dispatch(saveToLibraryRequest(id));
    dispatch(syncChapterUpdate(id));
    try {
      await cloudfunction.post('/saveLibrary', {
        userId: userId,
        manga: {
          id: id,
          title: title,
          imageUrl: imageUrl,
        },
      });
      dispatch(saveToLibrarySuccess(id, title, imageUrl));
    } catch (err) {
      console.log(err);
      dispatch(saveToLibraryFailure());
    }
  };
};

export const loadLibraryRequest = () => ({
  type: LOAD_LIBRARY_REQUEST,
});

export const loadLibrarySuccess = (libraryResult) => ({
  type: LOAD_LIBRARY_SUCCESS,
  payload: { libraryResult },
});

export const loadLibraryFailure = () => ({
  type: LOAD_LIBRARY_FAILURE,
});

export const loadLibrary = (userId) => {
  return async (dispatch) => {
    dispatch(loadLibraryRequest());
    try {
      const response = await cloudfunction.get(`/getLibrary?userId=${userId}`);
      dispatch(loadLibrarySuccess(response.data));
    } catch (err) {
      console.log(err);
      dispatch(loadLibraryFailure());
    }
  };
};

export const loadLibraryAndSelect = (userId) => {
  return async (dispatch) => {
    try {
      const response = await cloudfunction.get(`/getLibrary?userId=${userId}`);
      dispatch(selectMultipleMangaFetch(response.data));
    } catch (err) {
      console.log(err);
    }
  };
};

export const removeFromLibraryRequest = () => ({
  type: REMOVE_FROM_LIBRARY_REQUEST,
});

export const removeFromLibrarySuccess = (mangaId) => ({
  type: REMOVE_FROM_LIBRARY_SUCCESS,
  payload: {
    mangaId,
  },
});

export const removeFromLibraryFailure = () => ({
  type: REMOVE_FROM_LIBRARY_FAILURE,
});

export const removeFromLibrary = (userId, mangaId) => {
  return async (dispatch) => {
    dispatch(removeFromLibraryRequest());
    try {
      await cloudfunction.post('/removeFromLibrary', {
        userId: userId,
        mangaId: mangaId,
      });
      dispatch(removeFromLibrarySuccess(mangaId));
    } catch (err) {
      console.log(err);
      dispatch(removeFromLibraryFailure());
    }
  };
};
