import React from 'react';
import { useTheme } from '@react-navigation/native';
import { View } from 'react-native';

const ThemedView = ({ style, children }) => {
  const { colors } = useTheme();

  return (
    <View style={{ ...style, backgroundColor: colors.background }}>
      {children}
    </View>
  );
};

export default ThemedView;
