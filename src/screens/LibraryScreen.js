import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import MangaList from '../components/MangaList';
import ErrorContainer from '../components/ErrorContainer';
import { connect } from 'react-redux';
import {
  getMangaList,
  getLibraryLoadingStatus,
  getLoadError,
} from '../store/library/selectors';
import { getChapterTotals } from '../store/chapters/selectors';
import { getUserId } from '../store/account/selectors';
import { loadLibrary, loadLibraryAndSelect } from '../store/library/actions';
import { loadChapterTotalsAsyncStorage } from '../store/chapters/actions';

const LibraryScreen = ({
  navigation,
  mangaList,
  status,
  userId,
  loadLibrary,
  loadError,
  loadChapterTotalsAsyncStorage,
  chapterTotals,
}) => {
  useEffect(() => {
    loadChapterTotalsAsyncStorage();
    loadLibrary(userId);
    // loadLibraryAndSelect(userId);
  }, [userId]);
  const [refreshing, setRefreshing] = useState(false);
  if (status === 'idle' || status === 'pending') {
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

  if (status === 'rejected') {
    return <ErrorContainer errorMessage={loadError} />;
  }

  const mangaListWithUpdates = () => {
    return mangaList.map((manga) => {
      manga.updates = chapterTotals[manga.id];
      return manga;
    });
  };

  return (
    <View style={styles.container}>
      <MangaList
        results={mangaListWithUpdates()}
        // refreshing={refreshing}
        // onRefresh={() => {
        //   console.log('refresh');
        //   setRefreshing(true);
        // }}
      />
    </View>
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
    mangaList: getMangaList(state),
    status: getLibraryLoadingStatus(state),
    userId: getUserId(state),
    loadError: getLoadError(state),
    chapterTotals: getChapterTotals(state),
  };
};

export default connect(mapStateToProps, {
  loadLibrary,
  loadChapterTotalsAsyncStorage,
})(LibraryScreen);
