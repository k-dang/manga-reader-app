import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import MangaListHorizontal from '../components/MangaListHorizontal';
import { debounce } from 'lodash';
import ErrorContainer from '../components/ErrorContainer';

// store
import { useSelector, useDispatch } from 'react-redux';
import {
  getDiscoverLoadingStatus,
  getDiscoverError,
  getDiscoverResults,
} from '../store/discover/selectors';
import {
  fetchGenrePaginated,
  fetchDiscoverMangaGenres,
} from '../store/discover/actions';
import { getLibraryMangasById } from '../store/library/selectors';

const genres = ['Hot', 'Shoujo', 'Slice of life', 'Isekai', 'Romance'];

const DiscoverScreen = () => {
  const dispatch = useDispatch();
  const status = useSelector(getDiscoverLoadingStatus);
  const errorMessage = useSelector(getDiscoverError);
  const discoverResults = useSelector(getDiscoverResults);
  const libraryMangaByIds = useSelector(getLibraryMangasById);

  useEffect(() => {
    dispatch(fetchDiscoverMangaGenres(genres));
  }, [dispatch]);

  const handleEndReached = debounce(
    (genre) => {
      dispatch(fetchGenrePaginated(genre));
    },
    1000,
    { leading: true, trailing: false }
  );

  if (status === 'idle' || status === 'pending') {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          style={styles.spinner}
          size="large"
          color="#CCCCFF"
        />
      </View>
    );
  }

  if (status === 'rejected') {
    return <ErrorContainer errorMessage={errorMessage} />;
  }

  const resultsWithLibrary = (results) => {
    const withLibrary = results.map((result) => {
      if (result.id in libraryMangaByIds) {
        result.inLibrary = true;
      }
      return result;
    });
    return withLibrary;
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {genres.map((genre) => {
          return (
            <MangaListHorizontal
              key={genre}
              mangaResults={resultsWithLibrary(discoverResults[genre].results)}
              title={genre}
              onEndReached={() => handleEndReached(genre)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  spinner: {
    flex: 1,
  },
});

export default DiscoverScreen;
