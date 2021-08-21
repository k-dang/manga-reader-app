import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

const TransitionCard = ({ finishedChapterName, nextChapterName }) => {
  const { colors } = useTheme();
  const textStyles = [styles.transitionText, { color: colors.text }];
  return (
    <View
      style={[styles.transitionCard, { backgroundColor: colors.background }]}
    >
      <Text style={textStyles}>Finished:</Text>
      <Text style={textStyles}>{finishedChapterName}</Text>
      {nextChapterName ? (
        <>
          <Text style={textStyles}>Next:</Text>
          <Text style={textStyles}>{nextChapterName}</Text>
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  transitionCard: {
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
