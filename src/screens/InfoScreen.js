import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  Platform,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import ErrorContainer from '../components/ErrorContainer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-root-toast';

// store
import { connect } from 'react-redux';
import {
  getSelectFetchState,
  getMangaById,
  getSelectError,
} from '../store/select/selectors';
import { saveToLibrary, removeFromLibrary } from '../store/library/actions';
import { getUserId } from '../store/account/selectors';
import { getLibraryMangaById } from '../store/library/selectors';
import { saveChapterReadIfNeeded } from '../store/select/actions';
import { fetchChapterIfNeeded } from '../store/chapters/actions';

const InfoScreen = ({
  isFetching,
  selectedMangaDetail,
  error,
  navigation,
  saveToLibrary,
  userId,
  libraryManga,
  removeFromLibrary,
  saveChapterReadIfNeeded,
  fetchChapterIfNeeded,
}) => {
  useEffect(() => {
    navigation.setOptions({
      title: selectedMangaDetail.mangaTitle,
    });
  }, [selectedMangaDetail.mangaTitle]);
  const [favourite, setFavourite] = useState(libraryManga != undefined);
  const { colors } = useTheme();

  const favouriteIconName = favourite ? 'heart' : 'heart-outline';

  const toggleFavourite = () => {
    setFavourite(!favourite);
    if (!favourite) {
      saveToLibrary(
        selectedMangaDetail.mangaId,
        selectedMangaDetail.mangaTitle,
        selectedMangaDetail.infoImageUrl,
        userId
      );
      // if (Platform.OS === 'android') {
      //   ToastAndroid.show(
      //     'Saved to Library',
      //     ToastAndroid.SHORT,
      //     ToastAndroid.BOTTOM
      //   );
      // }
      Toast.show('Saved to Library', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
      });
    } else {
      removeFromLibrary(userId, selectedMangaDetail.mangaId);
      // if (Platform.OS === 'android') {
      //   ToastAndroid.show(
      //     'Removed from Library',
      //     ToastAndroid.SHORT,
      //     ToastAndroid.BOTTOM
      //   );
      // }
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
    const originalIndexIncluded = selectedMangaDetail.chapterRefs.map(
      (obj, i) => {
        return {
          ...obj,
          originalIndex: i,
        };
      }
    );
    const firstUnRead = originalIndexIncluded
      .reverse()
      .find((chapterRefObj) => !chapterRefObj.hasRead);
    saveChapterReadIfNeeded(
      selectedMangaDetail.mangaId,
      firstUnRead.chapterRef,
      firstUnRead.originalIndex
    );
    fetchChapterIfNeeded(firstUnRead.chapterRef, firstUnRead.originalIndex);
    navigation.navigate('MangaViewer');
  };

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

  if (error) {
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

const mapStateToProps = (state) => {
  return {
    isFetching: getSelectFetchState(state),
    selectedMangaDetail: getMangaById(state, state.select.selectedMangaId),
    error: getSelectError(state),
    userId: getUserId(state),
    libraryManga: getLibraryMangaById(state, state.select.selectedMangaId),
  };
};

export default connect(mapStateToProps, {
  saveToLibrary,
  removeFromLibrary,
  saveChapterReadIfNeeded,
  fetchChapterIfNeeded,
})(InfoScreen);
