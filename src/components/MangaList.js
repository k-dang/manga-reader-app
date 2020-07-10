import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import MangaCover from '../components/MangaCover';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import { selectMangaFetchIfNeeded } from '../store/select/actions';

const MangaList = ({ results, onEndReached, selectMangaFetchIfNeeded }) => {
  const navigation = useNavigation();

  const handleNavigation = (manga) => {
    selectMangaFetchIfNeeded(manga.title, manga.id);
    navigation.navigate('Info');
  };

  return (
    <FlatList
      data={results}
      keyExtractor={(result) => result.id}
      numColumns={2}
      columnWrapperStyle={styles.coverRow}
      renderItem={({ item }) => {
        return (
          <TouchableOpacity onPress={() => handleNavigation(item)}>
            <MangaCover mangaItem={item} />
          </TouchableOpacity>
        );
      }}
      ListHeaderComponent={() => {
        return <Text></Text>;
      }}
      onEndReached={onEndReached}
    />
  );
};

const styles = StyleSheet.create({
  coverRow: {
    justifyContent: 'space-evenly',
  },
});

export default connect(null, { selectMangaFetchIfNeeded })(MangaList);
