import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  StatusBar,
  Platform,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Icon, ListItem } from 'react-native-elements';
import Ripple from 'react-native-material-ripple';
import AsyncStorage from '@react-native-community/async-storage';
import ThemedView from '../components/ThemedView';
import { userProfiles } from '../services/userProfiles';

// store
import { connect } from 'react-redux';
import { saveAccount, toggleTheme } from '../store/account/actions';
import { getUserId } from '../store/account/selectors';

const SettingsScreen = ({ saveAccount, userId, toggleTheme, navigation }) => {
  const [color, setColor] = useState(
    userProfiles.find((profile) => profile.id === userId).bgColor
  );
  const { dark, colors } = useTheme();

  const handleToggleTheme = () => {
    toggleTheme();
    // take theme state before update
    // only on android
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(!dark ? 'black' : 'white');
    }
    StatusBar.setBarStyle(!dark ? 'light-content' : 'dark-content');
  };

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
              // <TouchableOpacity
              //   style={styles.avatar}
              //   onPress={() => {
              //     saveAccount(item.id);
              //     setColor(item.bgColor);
              //   }}
              // >
              // </TouchableOpacity>
              <View style={styles.avatar}>
                <Icon
                  reverse
                  name="user"
                  type="feather"
                  color={item.color}
                  size={28}
                  raised
                  onPress={() => {
                    saveAccount(item.id);
                    setColor(item.bgColor);
                  }}
                />
                <Text>{item.name}</Text>
              </View>
            );
          }}
        />
      </View>
      <View style={styles.settingsList}>
        <Ripple
          onPress={handleToggleTheme}
          rippleColor="rgb(211,211,211)"
          rippleOpacity={1}
        >
          <ListItem
            containerStyle={{ backgroundColor: colors.background }}
            titleStyle={{ color: colors.text }}
            title="App theme"
            leftIcon={{ name: 'moon', type: 'feather', size: 26, color: color }}
          />
        </Ripple>
        <Ripple
          onPress={() => navigation.navigate('Advanced')}
          rippleColor="rgb(211,211,211)"
          rippleOpacity={1}
        >
          <ListItem
            containerStyle={{ backgroundColor: colors.background }}
            titleStyle={{ color: colors.text }}
            title="Advanced"
            leftIcon={{
              name: 'coffee',
              type: 'feather',
              size: 26,
              color: color,
            }}
          />
        </Ripple>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  row: {
    paddingVertical: 10,
    justifyContent: 'space-around',
  },
  avatar: {
    alignItems: 'center',
  },
});

const mapStateToProps = (state) => {
  return {
    userId: getUserId(state),
  };
};

export default connect(mapStateToProps, { saveAccount, toggleTheme })(
  SettingsScreen
);
