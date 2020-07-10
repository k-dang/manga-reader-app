import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const ErrorContainer = ({ errorMessage }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{errorMessage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    fontSize: 18,
    color: 'grey',
  },
});

export default ErrorContainer;
