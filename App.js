import 'react-native-gesture-handler';
import React from 'react';
import { Provider } from 'react-redux';
import CustomNavigationContainer from './src/navigation/CustomNavigationContainer';
import { createStackNavigator } from '@react-navigation/stack';
import { RootSiblingParent } from 'react-native-root-siblings';

// screens
import MangaViewerScreen from './src/screens/MangaViewerScreen';
import InfoScreen from './src/screens/InfoScreen';
import ChaptersScreen from './src/screens/ChaptersScreen';
import AdvancedScreen from './src/screens/AdvancedScreen';
import TabScreen from './src/screens/TabScreen';

// components
import HeaderSearchBar from './src/components/HeaderSearchBar';
import HeaderRight from './src/components/HeaderRight';

// store
import store from './src/store';

const Stack = createStackNavigator();

const forFade = ({ current }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

const App = () => {
  return (
    <RootSiblingParent>
      <Provider store={store}>
        <CustomNavigationContainer>
          <Stack.Navigator initialRouteName="Tabs">
            <Stack.Screen
              name="Tabs"
              component={TabScreen}
              options={{  headerShown: false, cardStyleInterpolator: forFade }}
              // options={(props) => {
              //   const route = props.route;
              //   console.log(props);
              //   const currentIndex = route?.state?.index;
              //   if (currentIndex == undefined) {
              //     // hack for initial tab
              //     return {
              //       title: 'Library',
              //       headerRight: () => <HeaderRight />,
              //     };
              //   }

              //   switch (route.state.routeNames[currentIndex]) {
              //     case 'Library':
              //       return {
              //         title: 'Library',
              //         headerRight: () => <HeaderRight />,
              //       };
              //     case 'Discover':
              //       return {
              //         title: 'Discover',
              //       };
              //     case 'Settings':
              //       return {
              //         title: 'Settings',
              //       };
              //     case 'Search':
              //       return {
              //         // title: 'Search',
              //         headerTitle: () => <HeaderSearchBar />,
              //       };
              //   }
              // }}
            />
            <Stack.Screen
              name="MangaViewer"
              component={MangaViewerScreen}
              options={{ headerShown: false, cardStyleInterpolator: forFade }}
            />
            <Stack.Screen
              name="Info"
              component={InfoScreen}
              options={{ cardStyleInterpolator: forFade }}
            />
            <Stack.Screen
              name="Chapters"
              component={ChaptersScreen}
              options={{ cardStyleInterpolator: forFade }}
            />
            <Stack.Screen
              name="Advanced"
              component={AdvancedScreen}
              options={{ cardStyleInterpolator: forFade }}
            />
          </Stack.Navigator>
        </CustomNavigationContainer>
      </Provider>
    </RootSiblingParent>
  );
};

export default App;
