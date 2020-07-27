import React, { useState, useEffect } from 'react';
import { useTheme } from '@react-navigation/native';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import MangaList from '../components/MangaList';
import ErrorContainer from '../components/ErrorContainer';
import { Overlay } from 'react-native-elements';

// store
import { connect } from 'react-redux';
import {
  getMangaList,
  getLibraryLoadingStatus,
  getLoadError,
  getSortType,
} from '../store/library/selectors';
import { loadLibraryAndSelect } from '../store/library/actions';
import { getChapterTotals } from '../store/chapters/selectors';
import { getUserId } from '../store/account/selectors';
import { loadAllData } from '../store/account/actions';
import { sort } from '../store/library/constants';
import { getSelectFetchStatus } from '../store/select/selectors';

const LibraryScreen = ({
  mangaList,
  status,
  userId,
  loadError,
  chapterTotals,
  loadAllData,
  sortType,
  multiFetchStatus,
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
          color="#CCCCFF"
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
    const mergedMangaList = mangaList.map((manga) => {
      manga.updates = chapterTotals[manga.id];
      return manga;
    });

    switch (sortType) {
      case sort.UNREAD_DESC: {
        mergedMangaList.sort((a, b) => {
          return b.updates - a.updates;
        });
        break;
      }
      case sort.UNREAD_ASC: {
        mergedMangaList.sort((a, b) => {
          return a.updates - b.updates;
        });
        break;
      }
    }

    return mergedMangaList;
  };

  // TODO pull to refresh
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
      <Overlay
        isVisible={multiFetchStatus === 'pending'}
        overlayStyle={styles.overlay}
      >
        <ActivityIndicator
          style={styles.overlapSpinner}
          size="large"
          color="#CCCCFF"
        />
      </Overlay>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  spinner: {
    flex: 1,
  },
  overlay: {
    backgroundColor: 'transparent',
  },
});

const mapStateToProps = (state) => {
  return {
    mangaList: getMangaList(state),
    status: getLibraryLoadingStatus(state),
    userId: getUserId(state),
    loadError: getLoadError(state),
    chapterTotals: getChapterTotals(state),
    sortType: getSortType(state),
    multiFetchStatus: getSelectFetchStatus(state),
  };
};

export default connect(mapStateToProps, {
  loadAllData,
})(LibraryScreen);
