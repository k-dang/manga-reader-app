import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Ripple from 'react-native-material-ripple';
import { ListItem } from 'react-native-elements';
import ThemedView from '../components/ThemedView';
import AsyncStorage from '@react-native-community/async-storage';
import { userProfiles } from '../services/userProfiles';

// store
import { connect } from 'react-redux';
import { getUserId } from '../store/account/selectors';

const showKeys = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    console.log('keys', keys);
    // for (const key of keys) {
    //   console.log(
    //     `asyncStorage ${key}`,
    //     JSON.parse(await AsyncStorage.getItem(key))
    //   );
    // }
  } catch (e) {
    // read key error
    console.log(e);
  }
};

const testChapterUpdates = async () => {
  try {
    await AsyncStorage.setItem(
      'az918766',
      JSON.stringify({ totalChapters: 20 })
    );
  } catch (e) {}
};

const AdvancedScreen = ({ userId }) => {
  const { colors } = useTheme();
  const color = userProfiles.find((x) => x.id === userId).color;
  return (
    <ThemedView>
      <Ripple
        onPress={async () => {
          await AsyncStorage.clear();
          console.log('cleared');
          // TODO update all store chapter hasRead values?
        }}
        rippleColor="rgb(211,211,211)"
        rippleOpacity={1}
      >
        <ListItem
          title="Clear Storage"
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
          showKeys();
        }}
        rippleColor="rgb(211,211,211)"
        rippleOpacity={1}
      >
        <ListItem
          title="Show Async Storage"
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
          testChapterUpdates();
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
    </ThemedView>
  );
};

const mapStateToProps = (state) => {
  return {
    userId: getUserId(state),
  };
};

export default connect(mapStateToProps)(AdvancedScreen);
