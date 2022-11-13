import AsyncStorage from '@react-native-async-storage/async-storage';

export const updateTotalChaptersAsyncStorage = async (
  mangaId,
  totalChapters
) => {
  try {
    const value = await AsyncStorage.getItem(mangaId);
    const jsonValue = value ? JSON.parse(value) : {};
    jsonValue.totalChapters = totalChapters;
    await AsyncStorage.setItem(mangaId, JSON.stringify(jsonValue));
  } catch (e) {
    console.log(e);
  }
};

export const removePageItemAsyncStorage = async (mangaId) => {
  try {
    await AsyncStorage.removeItem(`${mangaId};page`);
  } catch (e) {
    console.log(e);
  }
};

export const getPageItemAsyncStorage = async (mangaId) => {
  try {
    const value = await AsyncStorage.getItem(`${mangaId};page`);
    return value ? value.split(';') : null;
  } catch (e) {
    console.log(e);
  }
};

// TOOD finish this
// export const setPageItemAsyncStorage = async (mangaId, ) => {
// }

// TODO refactor this
export const showPagesAsyncStorage = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    for (const key of keys) {
      if (!key.includes('page')) {
        continue;
      }
      console.log(`key: ${key} value:${await AsyncStorage.getItem(key)}`);
    }
  } catch (e) {
    console.log(e);
  }
};

export const getPagesAsyncStorage = async () => {
  try {
    const pageKeys = [];
    const keys = await AsyncStorage.getAllKeys();
    for (const key of keys) {
      if (!key.includes('page')) {
        continue;
      }
      pageKeys.push(key);
    }
    return pageKeys;
  } catch (e) {
    console.log(e);
  }
};

// TODO refactor this
export const showChapterKeysAsyncStorage = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    for (const key of keys) {
      if (key === 'userId' || key === 'theme' || key.includes('page')) {
        continue;
      }
      console.log(`key: ${key}`);
    }
  } catch (e) {
    // read key error
    console.log(e);
  }
};

export const getChapterKeysAsyncStorage = async () => {
  try {
    const chapterKeys = [];
    const keys = await AsyncStorage.getAllKeys();
    for (const key of keys) {
      if (key === 'userId' || key === 'theme' || key.includes('page')) {
        continue;
      }
      chapterKeys.push(key);
    }
    return chapterKeys;
  } catch (e) {
    // read key error
    console.log(e);
  }
};

export const showChapterAsyncStorage = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    for (const key of keys) {
      if (key === 'userId' || key === 'theme' || key.includes('page')) {
        continue;
      }
      console.log(`key: ${key} value:${await AsyncStorage.getItem(key)}`);
    }
  } catch (e) {
    // read key error
    console.log(e);
  }
};
