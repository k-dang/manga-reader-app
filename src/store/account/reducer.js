import {
  SET_ACCOUNT,
  SET_THEME,
  DEFAULT,
  LOAD_ACCOUNT_DATA,
} from './constants';

const initialState = {
  userId: '1',
  theme: DEFAULT,
};
const account = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACCOUNT: {
      const { userId } = action.payload;
      return {
        ...state,
        userId,
      };
    }
    case SET_THEME: {
      const { theme } = action.payload;
      return {
        ...state,
        theme,
      };
    }
    case LOAD_ACCOUNT_DATA: {
      const { userId, theme } = action.payload;
      return {
        ...state,
        userId: userId ? userId : state.userId,
        theme: theme ? theme : state.theme,
      };
    }
    default:
      return state;
  }
};

export default account;
