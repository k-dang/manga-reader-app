import { SET_ACCOUNT } from './constants';

const initialState = {
  userId: '1',
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
    default:
      return state;
  }
};

export default account;
