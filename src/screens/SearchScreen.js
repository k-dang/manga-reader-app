import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import MangaList from '../components/MangaList';
import ErrorContainer from '../components/ErrorContainer';
import {
  getFetchState,
  getSearchResults,
  getSearchError,
  getSearchTerm,
  getSearchTotalPages,
  getSearchLoadedPages,
} from '../store/search/selectors';
import { searchMangaPaginated } from '../store/search/actions';

const SearchScreen = (props) => {
  if (props.isFetching) {
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

  if (props.errorMessage != '') {
    return <ErrorContainer errorMessage={props.errorMessage} />;
  }

  const isResultsEmpty =
    props.searchResults.length == 0 && props.searchTerm != '';
  const handleEndReached = () => {
    if (props.loadedPages < props.totalPages) {
      const pageToLoad = props.loadedPages + 1;
      props.searchMangaPaginated(props.searchTerm, pageToLoad);
    }
  };

  return (
    <>
      {isResultsEmpty ? (
        <ErrorContainer errorMessage="No results found" />
      ) : (
        <View style={styles.container}>
          <MangaList
            results={props.searchResults}
            onEndReached={handleEndReached}
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

export default connect(mapStateToProps, { searchMangaPaginated })(SearchScreen);
