import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { CustomDarkTheme, CustomDefaultTheme } from '../theme/themes';

// store
import { connect } from 'react-redux';
import { getTheme } from '../store/account/selectors';
import { DARK } from '../store/account/constants';

const CustomNavigationContainer = ({ theme, children }) => {
  return (
    <NavigationContainer
      theme={theme === DARK ? CustomDarkTheme : CustomDefaultTheme}
    >
      {children}
    </NavigationContainer>
  );
};

const mapStateToProps = (state) => {
  return {
    theme: getTheme(state),
  };
};

export default connect(mapStateToProps)(CustomNavigationContainer);
