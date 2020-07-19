import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '@react-navigation/native';
import MangaList from '../components/MangaList';
import ErrorContainer from '../components/ErrorContainer';

// store
import { connect } from 'react-redux';
import {
  getFetchState,
  getSearchResults,
  getSearchError,
  getSearchTerm,
  getSearchTotalPages,
  getSearchLoadedPages,
} from '../store/search/selectors';
import { searchManga, searchMangaPaginated } from '../store/search/actions';

const SearchScreen = ({
  isFetching,
  errorMessage,
  searchResults,
  searchTerm,
  loadedPages,
  totalPages,
  searchMangaPaginated,
  searchManga,
}) => {
  const { colors } = useTheme();
  const container = [styles.container, { backgroundColor: colors.background }];

  if (isFetching) {
    return (
      <View style={container}>
        <ActivityIndicator
          style={styles.spinner}
          size="large"
          color="#0000ff"
        />
      </View>
    );
  }

  if (errorMessage != '') {
    return <ErrorContainer errorMessage={errorMessage} />;
  }

  if (searchResults.length == 0 && searchTerm != '') {
    return <ErrorContainer errorMessage="No results found" />;
  }

  const handleEndReached = () => {
    if (loadedPages < totalPages) {
      const pageToLoad = loadedPages + 1;
      searchMangaPaginated(searchTerm, pageToLoad);
    }
  };

  return (
    <>
      {searchResults.length === 0 ? (
        <ErrorContainer errorMessage="Search for a manga" />
      ) : (
        <View style={container}>
          <MangaList
            results={searchResults}
            onEndReached={handleEndReached}
            refreshing={isFetching}
            onRefresh={() => {
              searchManga(searchTerm);
            }}
          />
        </View>
      )}
    </>
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
    searchTerm: getSearchTerm(state),
    isFetching: getFetchState(state),
    searchResults: getSearchResults(state),
    errorMessage: getSearchError(state),
    totalPages: getSearchTotalPages(state),
    loadedPages: getSearchLoadedPages(state),
  };
};

export default connect(mapStateToProps, { searchManga, searchMangaPaginated })(
  SearchScreen
);
