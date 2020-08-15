import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '@react-navigation/native';
import MangaList from '../components/MangaList';
import ErrorContainer from '../components/ErrorContainer';
import { debounce } from 'lodash';

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
import { getLibraryMangasById } from '../store/library/selectors';

const SearchScreen = ({
  isFetching,
  errorMessage,
  searchResults,
  searchTerm,
  loadedPages,
  totalPages,
  searchMangaPaginated,
  searchManga,
  libraryMangaByIds,
}) => {
  const { colors } = useTheme();
  const container = [styles.container, { backgroundColor: colors.background }];

  if (isFetching) {
    return (
      <View style={container}>
        <ActivityIndicator
          style={styles.spinner}
          size="large"
          color="#CCCCFF"
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

  const handleEndReached = debounce(
    () => {
      if (loadedPages < totalPages) {
        const pageToLoad = loadedPages + 1;
        searchMangaPaginated(searchTerm, pageToLoad);
      }
    },
    1000,
    { leading: true, trailing: false }
  );

  const searchResultsWithLibrary = () => {
    const withLibrary = searchResults.map((searchResult) => {
      if (searchResult.id in libraryMangaByIds) {
        searchResult.inLibrary = true;
      }
      return searchResult;
    });
    return withLibrary;
  };

  return (
    <>
      {searchResults.length === 0 ? (
        <ErrorContainer errorMessage="search for a manga" />
      ) : (
        <View style={container}>
          <MangaList
            results={searchResultsWithLibrary()}
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
    libraryMangaByIds: getLibraryMangasById(state),
  };
};

export default connect(mapStateToProps, { searchManga, searchMangaPaginated })(
  SearchScreen
);
