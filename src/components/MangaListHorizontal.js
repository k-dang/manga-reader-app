import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import MangaCover from '../components/MangaCover';

// store
import { connect } from 'react-redux';
import { selectMangaFetchIfNeeded } from '../store/select/actions';
import { sources } from '../store/search/constants';

const MangaListHorizontal = ({
  mangaResults,
  title,
  onEndReached,
  selectMangaFetchIfNeeded,
}) => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const handleNavigation = (manga) => {
    selectMangaFetchIfNeeded(manga.id, manga.title, sources.MANGANATO);
    navigation.navigate('Info');
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <FlatList
        data={mangaResults}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(mangaResult) => mangaResult.id}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => handleNavigation(item)}
            >
              <MangaCover mangaItem={item} isSmall={true} />
            </TouchableOpacity>
          );
        }}
        onEndReached={onEndReached}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  title: {
    fontSize: 16,
    marginLeft: 15,
  },
  listItem: {
    marginLeft: 15,
  },
});

export default connect(null, { selectMangaFetchIfNeeded })(MangaListHorizontal);
