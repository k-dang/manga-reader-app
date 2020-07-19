export const getAccountState = (store) => store.account;

export const getUserId = (store) =>
  getAccountState(store) ? getAccountState(store).userId : null;

export const getTheme = (store) =>
getAccountState(store) ? getAccountState(store).theme : 'default';