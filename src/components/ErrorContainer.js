import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';

const ErrorContainer = ({ errorMessage }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={styles.huge}>;A;</Text>
      <Text style={styles.message}>{errorMessage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  huge: {
    fontSize: 84,
    color: 'lightgrey',
  },
  message: {
    fontSize: 18,
    color: 'lightgrey',
  },
});

export default ErrorContainer;
