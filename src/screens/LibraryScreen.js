import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MangaList from '../components/MangaList';

const coverImages = [
  {
    imageUrl: 'https://mangadex.org/images/manga/28495.jpg',
    id: '1',
    title: 'title 11111111111144444444444444444444444444444444444444444444444',
    updates: 1,
  },
  {
    imageUrl: 'https://mangadex.org/images/manga/3845.jpg',
    id: '2',
    title: 'title 2',
    updates: 5,
  },
  {
    imageUrl: 'https://mangadex.org/images/manga/28495.jpg',
    id: '3',
    title: 'title 3',
    updates: 0,
  },
  {
    imageUrl: 'https://mangadex.org/images/manga/3845.jpg',
    id: '4',
    title: 'title 4',
    updates: 3,
  },
  {
    imageUrl: 'https://mangadex.org/images/manga/28495.jpg',
    id: '5',
    title: 'title 5',
    updates: 0,
  },
];

const LibraryScreen = ({ navigation }) => {
  const [counter, setCounter] = useState(0);

  return (
    <View style={styles.container}>
      <MangaList results={coverImages} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default LibraryScreen;
