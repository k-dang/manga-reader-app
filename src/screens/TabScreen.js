import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// screens
import LibraryScreen from './LibraryScreen';
import SearchScreen from './SearchScreen';
import SettingsScreen from './SettingsScreen';
import DiscoverScreen from './DiscoverScreen';

const Tab = createBottomTabNavigator();

const TabScreen = () => {
  const { dark, colors } = useTheme();
  useEffect(() => {
    // only on android
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(dark ? 'black' : 'white');
    }
    StatusBar.setBarStyle(dark ? 'light-content' : 'dark-content');
  }, [dark]);
  return (
    <Tab.Navigator
      tabBarOptions={{
        inactiveTintColor: '#7F7F80',
        activeTintColor: colors.text,
      }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Library':
              iconName = 'book-variant-multiple';
              break;
            case 'Discover':
              iconName = 'earth';
              break;
            case 'Search':
              iconName = 'magnify';
              break;
            case 'Settings':
              iconName = focused ? 'cog' : 'cog-outline';
              break;
          }

          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },
      })}
      initialRouteName="Library"
    >
      <Tab.Screen name="Library" component={LibraryScreen} />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default TabScreen;
