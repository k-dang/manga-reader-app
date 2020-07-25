import React, { useState, useEffect } from 'react';
import { useTheme } from '@react-navigation/native';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import MangaList from '../components/MangaList';
import ErrorContainer from '../components/ErrorContainer';

// store
import { connect } from 'react-redux';
import {
  getMangaList,
  getLibraryLoadingStatus,
  getLoadError,
} from '../store/library/selectors';
import { loadLibraryAndSelect } from '../store/library/actions';
import { getChapterTotals } from '../store/chapters/selectors';
import { getUserId } from '../store/account/selectors';
import { loadAllData } from '../store/account/actions';

const LibraryScreen = ({
  mangaList,
  status,
  userId,
  loadError,
  chapterTotals,
  loadAllData,
}) => {
  useEffect(() => {
    loadAllData(userId);
    // loadLibraryAndSelect(userId);
  }, [userId]);
  const [refreshing, setRefreshing] = useState(false);
  const { dark, colors } = useTheme();

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

  if (status === 'resolved' && mangaList.length === 0) {
    return <ErrorContainer errorMessage="Library is empty" />;
  }

  const mangaListWithUpdates = () => {
    return mangaList.map((manga) => {
      manga.updates = chapterTotals[manga.id];
      return manga;
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
  loadAllData,
})(LibraryScreen);
