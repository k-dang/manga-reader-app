import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import ErrorContainer from '../components/ErrorContainer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-root-toast'; // TODO deprecated soon

// store
import { useSelector, useDispatch } from 'react-redux';
import {
  getMangaById,
  getSelectError,
  getSelectFetchStatus,
} from '../store/select/selectors';
import { saveToLibrary, removeFromLibrary } from '../store/library/actions';
import { getUserId } from '../store/account/selectors';
import { getLibraryMangaById } from '../store/library/selectors';
import {
  saveChapterReadIfNeeded,
  saveChapterPageRead,
} from '../store/select/actions';
import { fetchChapterIfNeeded } from '../store/chapters/actions';

const InfoScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const selectedMangaDetail = useSelector((state) =>
    getMangaById(state, state.select.selectedMangaId)
  );
  const error = useSelector(getSelectError);
  const userId = useSelector(getUserId);
  const libraryManga = useSelector((state) =>
    getLibraryMangaById(state, state.select.selectedMangaId)
  );
  const status = useSelector(getSelectFetchStatus);

  useEffect(() => {
    navigation.setOptions({
      title: selectedMangaDetail.mangaTitle,
    });
  }, [navigation, selectedMangaDetail.mangaTitle]);
  const [favourite, setFavourite] = useState(libraryManga != undefined);
  const { colors } = useTheme();

  const favouriteIconName = favourite ? 'heart' : 'heart-outline';

  const toggleFavourite = () => {
    setFavourite(!favourite);
    if (!favourite) {
      dispatch(
        saveToLibrary(
          selectedMangaDetail.mangaId,
          selectedMangaDetail.mangaTitle,
          selectedMangaDetail.infoImageUrl,
          userId,
          selectedMangaDetail.source
        )
      );

      Toast.show('Saved to Library', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
      });
    } else {
      dispatch(removeFromLibrary(userId, selectedMangaDetail.mangaId));

      Toast.show('Removed from Library', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
      });
    }
  };

  const handleChapterListNavigation = () => {
    navigation.navigate('Chapters');
  };

  const quickRead = () => {
    let chapterRefToRead = {};
    if (selectedMangaDetail.latestChapterRead) {
      const index = selectedMangaDetail.chapterRefs.findIndex(
        (x) => x.chapterRef === selectedMangaDetail.latestChapterRead
      );
      chapterRefToRead['chapterRef'] = selectedMangaDetail.latestChapterRead;
      chapterRefToRead['index'] = index;
    } else {
      const indexIncluded = selectedMangaDetail.chapterRefs.map((obj, i) => {
        return {
          ...obj,
          index: i,
        };
      });

      let firstUnRead = indexIncluded
        .reverse()
        .find((chapterRefObj) => !chapterRefObj.hasRead);
      if (firstUnRead == null) {
        firstUnRead = indexIncluded[indexIncluded.length - 1];
      }
      chapterRefToRead = firstUnRead;
    }
    dispatch(
      saveChapterReadIfNeeded(
        selectedMangaDetail.mangaId,
        chapterRefToRead.chapterRef,
        chapterRefToRead.index
      )
    );
    dispatch(
      fetchChapterIfNeeded(
        chapterRefToRead.chapterRef,
        chapterRefToRead.index,
        selectedMangaDetail.source
      )
    );
    dispatch(
      saveChapterPageRead(
        selectedMangaDetail.mangaId,
        chapterRefToRead.chapterRef,
        selectedMangaDetail.latestChapterPage
          ? selectedMangaDetail.latestChapterPage
          : 0
      )
    );
    navigation.navigate('MangaViewer');
  };

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

  if (status === 'rejected' && error) {
    return <ErrorContainer errorMessage={error} />;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View>
        <Image
          source={{ uri: selectedMangaDetail.infoImageUrl }}
          style={styles.imageBackground}
        />
        <Image
          source={{ uri: selectedMangaDetail.infoImageUrl }}
          style={styles.infoImage}
        />
      </View>
      <View style={styles.descriptionContainer}>
        <View style={styles.iconRow}>
          <TouchableOpacity style={styles.icons} onPress={quickRead}>
            <MaterialCommunityIcons
              name="play-outline"
              size={36}
              color={colors.text}
            />
            <Text style={{ color: colors.text }}>Read</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.icons}
            onPress={handleChapterListNavigation}
          >
            <MaterialCommunityIcons
              name="format-list-bulleted"
              size={36}
              color={colors.text}
            />
            <Text style={{ color: colors.text }}>Chapters</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.icons} onPress={toggleFavourite}>
            <MaterialCommunityIcons
              name={favouriteIconName}
              size={36}
              color={colors.text}
            />
            <Text style={{ color: colors.text }}>Favourite</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.textBold]}>About</Text>
        <Text style={{ color: colors.text }}>
          {selectedMangaDetail.cleanedDescription}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  spinner: {
    flex: 1,
  },
  imageBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.3,
    resizeMode: 'cover',
  },
  infoImage: {
    width: 150,
    height: 225,
    borderRadius: 8,
    alignSelf: 'center',
    marginVertical: 20,
  },
  descriptionContainer: {
    marginHorizontal: 20,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  icons: {
    alignItems: 'center',
  },
  textBold: {
    fontWeight: 'bold',
  },
});

InfoScreen.propTypes = {
  navigation: PropTypes.object,
};

export default InfoScreen;
