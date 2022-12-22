import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '@react-navigation/native';
import MangaList from '../components/MangaList';
import ErrorContainer from '../components/ErrorContainer';
import { debounce } from 'lodash';
import SourceSwitchButton from '../components/SourceSwitchButton';

// store
import { useSelector, useDispatch } from 'react-redux';
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
import { useCallback } from 'react';

const SearchScreen = () => {
  const { colors } = useTheme();
  const container = [styles.container, { backgroundColor: colors.background }];

  const dispatch = useDispatch();

  const status = useSelector(getSearchFetchStatus);
  const errorMessage = useSelector(getSearchError);
  const searchTerm = useSelector(getSearchTerm);
  const searchResults = useSelector(getSearchResults);
  const totalPages = useSelector(getSearchTotalPages);
  const loadedPages = useSelector(getSearchLoadedPages);
  const libraryMangaByIds = useSelector(getLibraryMangasById);
  const searchSource = useSelector(getSearchSource);
  const loadedResults = useSelector(getSearchLoadedResults);
  const totalResults = useSelector(getSearchTotalResults);

  const refreshSearch = useCallback(
    () => dispatch(searchManga(searchTerm)),
    [dispatch, searchTerm]
  );

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
      switch (searchSource) {
        case sources.MANGADEX: {
          if (loadedResults < totalResults) {
            dispatch(searchMangaPaginated(searchTerm));
          }
          break;
        }
        case sources.MANGANATO:
        default: {
          if (loadedPages < totalPages) {
            dispatch(searchMangaPaginated(searchTerm));
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
            onRefresh={refreshSearch}
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

export default SearchScreen;
