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
  } catch (e) {}
};

export const removePageItemAsyncStorage = async (chapterRef) => {
  try {
    await AsyncStorage.removeItem(`${chapterRef};page`);
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

export const showPagesAsyncStorage = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    for (const key of keys) {
      if (!key.includes('page')) {
        continue;
      }
      console.log(key, await AsyncStorage.getItem(key));
    }
  } catch (e) {
    console.log(e);
  }
};
