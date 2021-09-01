import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '@react-navigation/native';
import MangaList from '../components/MangaList';
import ErrorContainer from '../components/ErrorContainer';
import { debounce } from 'lodash';
import SourceSwitchButton from '../components/SourceSwitchButton';

// store
import { connect } from 'react-redux';
import {
  getSearchFetchStatus,
  getSearchResults,
  getSearchError,
  getSearchTerm,
  getSearchTotalPages,
  getSearchLoadedPages,
  getSearchSource,
  getSearchLoadedResults,
  getSearchTotalResults,
} from '../store/search/selectors';
import { searchManga, searchMangaPaginated } from '../store/search/actions';
import { getLibraryMangasById } from '../store/library/selectors';
import { sources } from '../store/search/constants';

const SearchScreen = ({
  status,
  errorMessage,
  searchResults,
  searchTerm,
  loadedPages,
  totalPages,
  searchMangaPaginated,
  searchManga,
  libraryMangaByIds,
  source,
  loadedResults,
  totalResults,
}) => {
  const { colors } = useTheme();
  const container = [styles.container, { backgroundColor: colors.background }];

  if (status === 'pending') {
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

  if (status === 'rejected') {
    return <ErrorContainer errorMessage={errorMessage} />;
  }

  if (searchResults.length == 0 && searchTerm != '') {
    return <ErrorContainer errorMessage="No results found" />;
  }

  const handleEndReached = debounce(
    () => {
      switch (source) {
        case sources.MANGADEX: {
          if (loadedResults < totalResults) {
            searchMangaPaginated(searchTerm);
          }
          break;
        }
        case sources.MANGANATO: {
          if (loadedPages < totalPages) {
            searchMangaPaginated(searchTerm);
          }
        }
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
            refreshing={status === 'pending'}
            onRefresh={() => {
              searchManga(searchTerm);
            }}
          />
        </View>
      )}
      <SourceSwitchButton></SourceSwitchButton>
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
    status: getSearchFetchStatus(state),
    searchResults: getSearchResults(state),
    errorMessage: getSearchError(state),
    totalPages: getSearchTotalPages(state),
    loadedPages: getSearchLoadedPages(state),
    libraryMangaByIds: getLibraryMangasById(state),
    source: getSearchSource(state),
    loadedResults: getSearchLoadedResults(state),
    totalResults: getSearchTotalResults(state),
  };
};

export default connect(mapStateToProps, { searchManga, searchMangaPaginated })(
  SearchScreen
);
