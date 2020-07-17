import { SET_ACCOUNT } from './constants';
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
