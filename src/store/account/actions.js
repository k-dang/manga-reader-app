import {
  SET_ACCOUNT,
  SET_THEME,
  DEFAULT,
  DARK,
  LOAD_ACCOUNT_DATA,
} from './constants';
import AsyncStorage from '@react-native-community/async-storage';
import { loadLibrary } from '../library/actions';
import { loadChapterTotalsAsyncStorage } from '../chapters/actions';

export const setAccount = (userId) => ({
  type: SET_ACCOUNT,
  payload: {
    userId,
  },
});

export const saveAccount = (userId) => {
  return async (dispatch) => {
    try {
      await AsyncStorage.setItem('userId', userId);
      dispatch(setAccount(userId));
    } catch (e) {
      console.log(e);
    }
  };
};

export const setTheme = (theme) => ({
  type: SET_THEME,
  payload: {
    theme,
  },
});

export const toggleTheme = () => {
  return async (dispatch, getState) => {
    try {
      let theme;
      switch (getState().account.theme) {
        case DEFAULT:
          theme = DARK;
          break;
        case DARK:
          theme = DEFAULT;
          break;
      }

      await AsyncStorage.setItem('theme', theme);
      dispatch(setTheme(theme));
    } catch (e) {
      console.log(e);
    }
  };
};

const loadAccountData = (userId, theme) => ({
  type: LOAD_ACCOUNT_DATA,
  payload: { userId, theme },
});

export const loadAccountDataAsyncStorage = () => {
  return async (dispatch) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const theme = await AsyncStorage.getItem('theme');

      dispatch(loadAccountData(userId, theme));
    } catch (e) {
      console.log(e);
    }
  };
};

export const loadAllData = () => {
  return async (dispatch) => {
    const userId = await AsyncStorage.getItem('userId');
    const theme = await AsyncStorage.getItem('theme');

    await dispatch(loadAccountData(userId, theme));
    await dispatch(loadLibrary(userId));
    await dispatch(loadChapterTotalsAsyncStorage());
  };
};
