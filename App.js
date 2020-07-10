import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import { DefaultTheme, DarkTheme } from '@react-navigation/native';

// screens
import LibraryScreen from './src/screens/LibraryScreen';
import MangaViewerScreen from './src/screens/MangaViewerScreen';
import AccountScreen from './src/screens/AccountScreen';
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
const MangaDetailTab = createMaterialTopTabNavigator();

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
            case 'Account':
              iconName = focused ? 'account' : 'account-outline';
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
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}

const forFade = ({ current, closing }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

function MangaDetailTabsScreen() {
  return (
    <MangaDetailTab.Navigator
      tabBarOptions={{
        indicatorStyle: {
          backgroundColor: 'black',
          // height: 3,
          borderRadius: 2,
        },
      }}
    >
      <MangaDetailTab.Screen name="Info" component={InfoScreen} />
      <MangaDetailTab.Screen name="Chapters" component={ChaptersScreen} />
    </MangaDetailTab.Navigator>
  );
}

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
                return null;
              }

              switch (route.state.routeNames[currentIndex]) {
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
