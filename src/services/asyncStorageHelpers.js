import AsyncStorage from '@react-native-community/async-storage';

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
