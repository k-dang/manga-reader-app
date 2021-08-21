import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

const LoadingCard = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator style={styles.spinner} size="large" color="#CCCCFF" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  spinner: {
    flex: 1,
  }
});

export default LoadingCard;
