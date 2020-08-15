import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import MangaListHorizontal from '../components/MangaListHorizontal';
import { debounce } from 'lodash';

// store
import { connect } from 'react-redux';
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

const DiscoverScreen = ({
  status,
  errorMessage,
  discoverResults,
  fetchDiscoverMangaGenres,
  fetchGenrePaginated,
  libraryMangaByIds,
}) => {
  const genres = ['Hot', 'Shoujo', 'Slice of life', 'Isekai', 'Romance'];
  useEffect(() => {
    fetchDiscoverMangaGenres(genres);
  }, []);
  const { colors } = useTheme();

  const handleEndReached = debounce(
    (genre) => {
      fetchGenrePaginated(genre);
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

const mapStateToProps = (state) => {
  return {
    status: getDiscoverLoadingStatus(state),
    errorMessage: getDiscoverError(state),
    discoverResults: getDiscoverResults(state),
    libraryMangaByIds: getLibraryMangasById(state),
  };
};

export default connect(mapStateToProps, {
  fetchGenrePaginated,
  fetchDiscoverMangaGenres,
})(DiscoverScreen);
