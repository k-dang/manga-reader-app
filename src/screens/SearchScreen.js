import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
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
  if (isFetching) {
    return (
      <View style={styles.container}>
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

  const isResultsEmpty = searchResults.length == 0 && searchTerm != '';
  const handleEndReached = () => {
    if (loadedPages < totalPages) {
      const pageToLoad = loadedPages + 1;
      searchMangaPaginated(searchTerm, pageToLoad);
    }
  };

  return (
    <>
      {isResultsEmpty ? (
        <ErrorContainer errorMessage="No results found" />
      ) : (
        <View style={styles.container}>
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
    backgroundColor: '#fff',
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
