import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Badge } from 'react-native-elements';

const MangaCover = ({ mangaItem }) => {
  return (
    <View style={styles.cover}>
      <Image source={{ uri: mangaItem.imageUrl }} style={styles.image} />
      <Text numberOfLines={2} style={styles.titleText}>
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
    width: 175,
    height: 250,
    borderRadius: 10,
  },
  titleText: {
    fontWeight: '600',
    width: 175,
  },
});

export default MangaCover;