import React, { useEffect } from 'react';
import { useTheme } from '@react-navigation/native';
import { StyleSheet, View, ActivityIndicator } from 'react-native';

import MangaList from '../components/MangaList';
import ErrorContainer from '../components/ErrorContainer';

// store
import { useSelector, useDispatch } from 'react-redux';
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

const LibraryScreen = () => {
  const dispatch = useDispatch();
  const status = useSelector(getLibraryLoadingStatus);
  const userId = useSelector(getUserId);
  const loadError = useSelector(getLoadError);
  const sortType = useSelector(getSortType);
  const multiFetchStatus = useSelector(getSelectFetchStatus);
  const chapterTotals = useSelector(getChapterTotals);
  const mangaList = useSelector(getMangaList);

  useEffect(() => {
    dispatch(loadAllData(userId));
  }, [dispatch, userId]);

  const { colors } = useTheme();

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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <MangaList
        results={mangaListWithUpdates()}
        refreshing={multiFetchStatus === 'pending'}
        onRefresh={() => dispatch(loadLibraryAndSelect(userId))}
      />
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

export default LibraryScreen;
