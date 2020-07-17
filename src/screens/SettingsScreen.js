import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import { ListItem } from 'react-native-elements';
import Ripple from 'react-native-material-ripple';
import AsyncStorage from '@react-native-community/async-storage';
import { saveAccount } from '../store/account/actions';
import { getUserId } from '../store/account/selectors';

const userProfiles = [
  {
    id: '1',
    name: 'User 1',
    color: 'rgb(247, 209, 205)',
    bgColor: 'rgba(247, 209, 205, 0.8)',
  },
  {
    id: '2',
    name: 'User 2',
    color: 'rgb(209, 179, 196)',
    bgColor: 'rgba(209, 179, 196, 0.8)',
  },
];

const showKeys = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    console.log('keys', keys);
    for (const key of keys) {
      console.log(
        `asyncStorage ${key}`,
        JSON.parse(await AsyncStorage.getItem(key))
      );
    }
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

const SettingsScreen = ({ saveAccount, userId }) => {
  const [color, setColor] = useState(
    userProfiles.find((profile) => profile.id === userId).bgColor
  );
  return (
    <View style={styles.container}>
      <View>
        <FlatList
          data={userProfiles}
          keyExtractor={(userProfile) => userProfile.id}
          numColumns={2}
          columnWrapperStyle={[styles.row, { backgroundColor: color }]}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={styles.avatar}
                onPress={() => {
                  saveAccount(item.id);
                  setColor(item.bgColor);
                }}
              >
                <Icon
                  reverse
                  name="user"
                  type="feather"
                  color={item.color}
                  size={28}
                />
                <Text>{item.name}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      <View style={styles.settingsList}>
        <Ripple>
          <ListItem
            title="App theme"
            leftIcon={{ name: 'moon', type: 'feather', size: 26, color: color }}
            bottomDivider
          />
        </Ripple>
        <Ripple
          onPress={async () => {
            await AsyncStorage.clear();
            console.log('cleared');
            // TODO update all store values?
          }}
        >
          <ListItem
            title="Clear Storage"
            leftIcon={{
              name: 'compass',
              type: 'feather',
              size: 26,
              color: color,
            }}
            bottomDivider
          />
        </Ripple>
        <Ripple
          onPress={async () => {
            showKeys();
          }}
        >
          <ListItem
            title="Show Async Storage"
            leftIcon={{
              name: 'compass',
              type: 'feather',
              size: 26,
              color: color,
            }}
            bottomDivider
          />
        </Ripple>
        <Ripple
          onPress={async () => {
            testChapterUpdates();
          }}
        >
          <ListItem
            title="Test chapter updates"
            leftIcon={{
              name: 'alert-circle',
              type: 'feather',
              size: 26,
              color: color,
            }}
            bottomDivider
          />
        </Ripple>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  row: {
    paddingVertical: 10,
    justifyContent: 'space-around',
  },
  avatar: {
    alignItems: 'center',
  },
  // settingsList: {
  //   flex: 1,
  // },
});

const mapStateToProps = (state) => {
  return {
    userId: getUserId(state),
  };
};

export default connect(mapStateToProps, { saveAccount })(SettingsScreen);
