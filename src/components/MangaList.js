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

const MangaList = ({
  results,
  onEndReached,
  selectMangaFetchIfNeeded,
  onRefresh,
  refreshing,
}) => {
  const navigation = useNavigation();

  const handleNavigation = (manga) => {
    selectMangaFetchIfNeeded(manga.id, manga.title);
    navigation.navigate('Info');
  };

  return (
    <FlatList
      data={results}
      keyExtractor={(result) => result.id}
      numColumns={2}
      renderItem={({ item }) => {
        return (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => handleNavigation(item)}
          >
            <MangaCover mangaItem={item} />
          </TouchableOpacity>
        );
      }}
      ListHeaderComponent={() => {
        return <Text></Text>;
      }}
      onEndReached={onEndReached}
      onRefresh={onRefresh}
      refreshing={refreshing}
    />
  );
};

const styles = StyleSheet.create({
  listItem: {
    flex: 1 / 2,
    alignItems: 'center',
  },
});

export default connect(null, { selectMangaFetchIfNeeded })(MangaList);
