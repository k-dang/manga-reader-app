import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { DefaultTheme, DarkTheme } from '@react-navigation/native';

// screens
import LibraryScreen from './src/screens/LibraryScreen';
import MangaViewerScreen from './src/screens/MangaViewerScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import SearchScreen from './src/screens/SearchScreen';
import InfoScreen from './src/screens/InfoScreen';
import ChaptersScreen from './src/screens/ChaptersScreen';

// components
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HeaderSearchBar from './src/components/HeaderSearchBar';

// store
import store from './src/store';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabsScreen() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Library':
              iconName = focused ? 'book' : 'book-outline';
              break;
            case 'Search':
              iconName = 'magnify';
              break;
            case 'Settings':
              iconName = focused ? 'settings' : 'settings-outline';
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
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const forFade = ({ current, closing }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Tabs">
          <Stack.Screen
            name="Tabs"
            component={TabsScreen}
            options={({ route }) => {
              const currentIndex = route?.state?.index;
              if (currentIndex == undefined) {
                // hack for initial tab
                return {
                  title: 'Library'
                };
              }

              switch (route.state.routeNames[currentIndex]) {
                case 'Library':
                  return {
                    title: 'Library',
                  };
                case 'Settings':
                  return {
                    title: 'Settings',
                  };
                case 'Search':
                  return {
                    headerTitle: () => {
                      return <HeaderSearchBar />;
                    },
                  };
              }
            }}
          />
          <Stack.Screen
            name="MangaViewer"
            component={MangaViewerScreen}
            options={{ headerShown: false, cardStyleInterpolator: forFade }}
          />
          <Stack.Screen name="Info" component={InfoScreen} />
          <Stack.Screen name="Chapters" component={ChaptersScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
