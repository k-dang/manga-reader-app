import React from 'react';
import { useTheme } from '@react-navigation/native';
import Ripple from 'react-native-material-ripple';
import { Icon, ListItem } from 'react-native-elements';
import ThemedView from '../components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userProfiles } from '../services/userProfiles';
import {
  showPagesAsyncStorage,
  showChapterKeysAsyncStorage,
  getChapterKeysAsyncStorage,
  showChapterAsyncStorage,
  getPagesAsyncStorage,
} from '../services/asyncStorageHelpers';
import { useSelector } from 'react-redux';

// store
import { getUserId } from '../store/account/selectors';
import { getMangaList } from '../store/library/selectors';

const testChapterUpdates = async () => {
  try {
    await AsyncStorage.setItem(
      'az918766',
      JSON.stringify({ totalChapters: 20 })
    );
  } catch (e) {
    console.log(e);
  }
};

const getKeysToClear = (storageKeys, mangasInLibrary) => {
  const result = storageKeys.filter(
    (key) => mangasInLibrary.indexOf(key) == -1
  );
  return result;
};

const AdvancedScreen = () => {
  const { colors } = useTheme();
  const userId = useSelector(getUserId);
  const mangaList = useSelector(getMangaList);

  const color = userProfiles.find((x) => x.id === userId).color;

  const clearChapterKeysNotInLibrary = async () => {
    // TODO update all store chapter hasRead values?
    const chapterKeys = await getChapterKeysAsyncStorage();
    const mangasInLibrary = mangaList.reduce((p, c) => {
      return [...p, c.id];
    }, []);
    const keysToClear = getKeysToClear(chapterKeys, mangasInLibrary);
    await AsyncStorage.multiRemove(keysToClear);
  };

  const clearPageKeysNotInLibrary = async () => {
    const pageKeys = await getPagesAsyncStorage();
    const mangasInLibrary = mangaList.reduce((p, c) => {
      return [...p, c.id + ';page'];
    }, []);
    const keysToClear = getKeysToClear(pageKeys, mangasInLibrary);
    await AsyncStorage.multiRemove(keysToClear);
  };

  return (
    <ThemedView>
      <Ripple
        onPress={async () => {
          await showChapterKeysAsyncStorage();
        }}
        rippleColor="rgb(211,211,211)"
        rippleOpacity={1}
      >
        <ListItem containerStyle={{ backgroundColor: colors.background }}>
          <Icon name="compass" type="feather" size={26} color={color} />
          <ListItem.Title style={{ color: colors.text }}>
            Show Async Storage Chapter Keys
          </ListItem.Title>
        </ListItem>
      </Ripple>
      <Ripple
        onPress={async () => {
          await showChapterAsyncStorage();
        }}
        rippleColor="rgb(211,211,211)"
        rippleOpacity={1}
      >
        <ListItem containerStyle={{ backgroundColor: colors.background }}>
          <Icon name="compass" type="feather" size={26} color={color} />
          <ListItem.Title style={{ color: colors.text }}>
            Show Async Storage Chapter Values
          </ListItem.Title>
        </ListItem>
      </Ripple>
      <Ripple
        onPress={async () => {
          await showPagesAsyncStorage();
        }}
        rippleColor="rgb(211,211,211)"
        rippleOpacity={1}
      >
        <ListItem containerStyle={{ backgroundColor: colors.background }}>
          <Icon name="compass" type="feather" size={26} color={color} />
          <ListItem.Title style={{ color: colors.text }}>
            Show Async Storage Pages
          </ListItem.Title>
        </ListItem>
      </Ripple>
      <Ripple
        onPress={async () => {
          await clearPageKeysNotInLibrary();
        }}
        rippleColor="rgb(211,211,211)"
        rippleOpacity={1}
      >
        <ListItem containerStyle={{ backgroundColor: colors.background }}>
          <Icon name="compass" type="feather" size={26} color={color} />
          <ListItem.Title style={{ color: colors.text }}>
            Clear Async Storage Pages (Latest Read, Not in library)
          </ListItem.Title>
        </ListItem>
      </Ripple>
      <Ripple
        onPress={async () => {
          await clearChapterKeysNotInLibrary();
        }}
        rippleColor="rgb(211,211,211)"
        rippleOpacity={1}
      >
        <ListItem containerStyle={{ backgroundColor: colors.background }}>
          <Icon name="compass" type="feather" size={26} color={color} />
          <ListItem.Title style={{ color: colors.text }}>
            Clear Async Storage Chapters (Not in library)
          </ListItem.Title>
        </ListItem>
      </Ripple>
      <Ripple
        onPress={async () => {
          await testChapterUpdates();
        }}
        rippleColor="rgb(211,211,211)"
        rippleOpacity={1}
      >
        <ListItem containerStyle={{ backgroundColor: colors.background }}>
          <Icon name="compass" type="feather" size={26} color={color} />
          <ListItem.Title style={{ color: colors.text }}>
            Test chapter updates
          </ListItem.Title>
        </ListItem>
      </Ripple>
      <Ripple
        onPress={async () => {
          const values = await AsyncStorage.getItem('manga-ax951880');
          console.log(values);
        }}
        rippleColor="rgb(211,211,211)"
        rippleOpacity={1}
      >
        <ListItem containerStyle={{ backgroundColor: colors.background }}>
          <Icon name="alert-circle" type="feather" size={26} color={color} />
          <ListItem.Title style={{ color: colors.text }}>
            Get specific chapter updates
          </ListItem.Title>
        </ListItem>
      </Ripple>
    </ThemedView>
  );
};

export default AdvancedScreen;
