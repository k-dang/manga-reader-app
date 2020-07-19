import { SET_ACCOUNT, SET_THEME, DEFAULT, DARK } from './constants';
import AsyncStorage from '@react-native-community/async-storage';

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
