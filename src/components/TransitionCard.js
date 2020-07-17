import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TransitionCard = ({ finishedChapterName, nextChapterName }) => {
  return (
    <View style={styles.transitionCard}>
      <Text style={styles.transitionText}>Finished:</Text>
      <Text style={styles.transitionText}>{finishedChapterName}</Text>
      {nextChapterName ? (
        <>
          <Text style={styles.transitionText}>Next:</Text>
          <Text style={styles.transitionText}>{nextChapterName}</Text>
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  transitionCard: {
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 50,
  },
  transitionText: {
    color: 'darkgrey',
    fontSize: 20,
  },
});

export default TransitionCard;
