import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Ripple from 'react-native-material-ripple';
import { ListItem } from 'react-native-elements';
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

// store
import { connect } from 'react-redux';
import { getUserId } from '../store/account/selectors';
import { getMangaList } from '../store/library/selectors';

const testChapterUpdates = async () => {
  try {
    await AsyncStorage.setItem(
      'az918766',
      JSON.stringify({ totalChapters: 20 })
    );
  } catch (e) {}
};

const getKeysToClear = (storageKeys, mangasInLibrary) => {
  const result = storageKeys.filter(
    (key) => mangasInLibrary.indexOf(key) == -1
  );
  return result;
};

const AdvancedScreen = ({ userId, mangaList }) => {
  const { colors } = useTheme();
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
        <ListItem
          title="Show Async Storage Chapter Keys"
          containerStyle={{ backgroundColor: colors.background }}
          titleStyle={{ color: colors.text }}
          leftIcon={{
            name: 'compass',
            type: 'feather',
            size: 26,
            color: color,
          }}
        />
      </Ripple>
      <Ripple
        onPress={async () => {
          await showChapterAsyncStorage();
        }}
        rippleColor="rgb(211,211,211)"
        rippleOpacity={1}
      >
        <ListItem
          title="Show Async Storage Chapter Values"
          containerStyle={{ backgroundColor: colors.background }}
          titleStyle={{ color: colors.text }}
          leftIcon={{
            name: 'compass',
            type: 'feather',
            size: 26,
            color: color,
          }}
        />
      </Ripple>
      <Ripple
        onPress={async () => {
          await showPagesAsyncStorage();
        }}
        rippleColor="rgb(211,211,211)"
        rippleOpacity={1}
      >
        <ListItem
          title="Show Async Storage Pages"
          containerStyle={{ backgroundColor: colors.background }}
          titleStyle={{ color: colors.text }}
          leftIcon={{
            name: 'compass',
            type: 'feather',
            size: 26,
            color: color,
          }}
        />
      </Ripple>
      <Ripple
        onPress={async () => {
          await clearPageKeysNotInLibrary();
        }}
        rippleColor="rgb(211,211,211)"
        rippleOpacity={1}
      >
        <ListItem
          title="Clear Async Storage Pages (Latest Read, Not in library)"
          containerStyle={{ backgroundColor: colors.background }}
          titleStyle={{ color: colors.text }}
          leftIcon={{
            name: 'compass',
            type: 'feather',
            size: 26,
            color: color,
          }}
        />
      </Ripple>
      <Ripple
        onPress={async () => {
          await clearChapterKeysNotInLibrary();
        }}
        rippleColor="rgb(211,211,211)"
        rippleOpacity={1}
      >
        <ListItem
          title="Clear Async Storage Chapters (Not in library)"
          containerStyle={{ backgroundColor: colors.background }}
          titleStyle={{ color: colors.text }}
          leftIcon={{
            name: 'compass',
            type: 'feather',
            size: 26,
            color: color,
          }}
        />
      </Ripple>
      <Ripple
        onPress={async () => {
          await testChapterUpdates();
        }}
        rippleColor="rgb(211,211,211)"
        rippleOpacity={1}
      >
        <ListItem
          title="Test chapter updates"
          containerStyle={{ backgroundColor: colors.background }}
          titleStyle={{ color: colors.text }}
          leftIcon={{
            name: 'alert-circle',
            type: 'feather',
            size: 26,
            color: color,
          }}
        />
      </Ripple>
      <Ripple
        onPress={async () => {
          const values = await AsyncStorage.getItem('manga-ax951880');
          console.log(values);
        }}
        rippleColor="rgb(211,211,211)"
        rippleOpacity={1}
      >
        <ListItem
          title="Get specific chapter updates"
          containerStyle={{ backgroundColor: colors.background }}
          titleStyle={{ color: colors.text }}
          leftIcon={{
            name: 'alert-circle',
            type: 'feather',
            size: 26,
            color: color,
          }}
        />
      </Ripple>
    </ThemedView>
  );
};

const mapStateToProps = (state) => {
  return {
    userId: getUserId(state),
    mangaList: getMangaList(state),
  };
};

export default connect(mapStateToProps)(AdvancedScreen);
