import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Icon, ListItem } from 'react-native-elements';
import Ripple from 'react-native-material-ripple';
import { userProfiles } from '../services/userProfiles';

// store
import { useSelector, useDispatch } from 'react-redux';
import { saveAccount, toggleTheme } from '../store/account/actions';
import { getUserId } from '../store/account/selectors';

const SettingsScreen = ({ navigation }) => {
  const userId = useSelector(getUserId);
  const [color, setColor] = useState(
    userProfiles.find((profile) => profile.id === userId).bgColor
  );
  const { colors } = useTheme();

  const dispatch = useDispatch();

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
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
                    dispatch(saveAccount(item.id));
                    setColor(item.bgColor);
                  }}
                />
                <Text>{item.name}</Text>
              </View>
            );
          }}
        />
      </View>
      <View>
        <Ripple
          onPress={handleToggleTheme}
          rippleColor="rgb(211,211,211)"
          rippleOpacity={1}
        >
          <ListItem containerStyle={{ backgroundColor: colors.background }}>
            <Icon name="moon" type="feather" size={26} color={color} />
            <ListItem.Title style={{ color: colors.text }}>
              App Theme
            </ListItem.Title>
          </ListItem>
        </Ripple>
        <Ripple
          onPress={() => navigation.navigate('Advanced')}
          rippleColor="rgb(211,211,211)"
          rippleOpacity={1}
        >
          <ListItem containerStyle={{ backgroundColor: colors.background }}>
            <Icon name="coffee" type="feather" size={26} color={color} />
            <ListItem.Title style={{ color: colors.text }}>
              Advanced
            </ListItem.Title>
          </ListItem>
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

SettingsScreen.propTypes = {
  navigation: PropTypes.object,
};

export default SettingsScreen;
