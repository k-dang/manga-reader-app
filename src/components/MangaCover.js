import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Badge } from 'react-native-elements';

const MangaCover = ({ mangaItem, isSmall }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.cover, mangaItem.inLibrary ? styles.inLibrary : null]}>
      <Image
        source={{ uri: mangaItem.imageUrl }}
        style={isSmall ? styles.smallImage : styles.image}
      />
      <Text
        numberOfLines={2}
        style={[
          isSmall ? styles.smallTitleText : styles.titleText,
          { color: colors.text },
        ]}
      >
        {mangaItem.title}
      </Text>
      {mangaItem.updates ? (
        <Badge
          value={mangaItem.updates}
          status="primary"
          containerStyle={{ position: 'absolute', top: -4, left: -4 }}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  cover: {
    marginBottom: 10,
  },
  image: {
    width: 170,
    height: 250,
    borderRadius: 10,
  },
  titleText: {
    fontWeight: '600',
    width: 170,
  },
  smallImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  smallTitleText: {
    fontWeight: '600',
    width: 120,
    fontSize: 12,
  },
  inLibrary: {
    opacity: 0.5,
  },
});

export default MangaCover;
