export const getAccountState = (store) => store.account;

export const getUserId = (store) =>
  getAccountState(store) ? getAccountState(store).userId : null;
