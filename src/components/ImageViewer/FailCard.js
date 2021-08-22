import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const FailCard = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.largeText}>(ಡ‸ಡ)</Text>
      <Text style={styles.smallText}>Failed to load image</Text>
      <Text style={styles.smallText}>Tap me try again</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  largeText: {
    fontSize: 64,
    color: 'lightgrey',
  },
  smallText: {
    fontSize: 20,
    color: 'lightgrey',
  },
});

export default FailCard;
