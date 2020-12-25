import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import Swiper from 'react-native-swiper';
import TransitionCard from '../components/TransitionCard';
import GestureRecognizer from 'react-native-swipe-gestures';
import { Overlay } from 'react-native-elements';
import { Feather } from '@expo/vector-icons';
import { removePageItemAsyncStorage } from '../services/asyncStorageHelpers';

// store
import { connect } from 'react-redux';
import {
  getCurrentChapterRef,
  getCurrentChapterRefIndex,
  getChaptersFetchState,
  getChaptersByChapterRef,
} from '../store/chapters/selectors';
import { getMangaById } from '../store/select/selectors';
import { fetchChapterIfNeeded } from '../store/chapters/actions';
import {
  saveChapterReadIfNeeded,
  saveChapterPageRead,
} from '../store/select/actions';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const renderNextButton = () => {
  return (
    <View style={styles.nextButton}>
      <Text></Text>
    </View>
  );
};

const renderPrevButton = () => {
  return (
    <View style={styles.nextButton}>
      <Text></Text>
    </View>
  );
};

const MangaViewerScreen = ({
  isFetching,
  currentChapterRef,
  currentChapterIndex,
  chaptersByChapterRef,
  selectedMangaDetail,
  fetchChapterIfNeeded,
  saveChapterReadIfNeeded,
  saveChapterPageRead,
  navigation,
}) => {
  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    return () => {
      // clean up effect
      StatusBar.setBarStyle('light-content');
    };
  }, []);
  const renderImages = () => {
    const images = chaptersByChapterRef[currentChapterRef].map((element) => {
      return (
        <Image
          key={element.url}
          source={{
            uri: `${element.url}`,
            headers: {
              Referer: `https://manganelo.com/chapter${currentChapterRef}`,
            },
          }}
          style={[styles.chapterImage]}
          onError={(err) => {
            console.log(err.nativeEvent);
          }}
        />
      );
    });
    if (images.length > 0) {
      const selectedChapterRefObject =
        selectedMangaDetail.chapterRefs[currentChapterIndex];
      const nextChapterName = selectedMangaDetail.chapterRefs.find(
        (element) => element.chapterRef == selectedChapterRefObject.next
      )?.name;
      images.push(
        <TransitionCard
          key={`${currentChapterRef}-card`}
          finishedChapterName={selectedChapterRefObject.name}
          nextChapterName={nextChapterName}
        />
      );
      images.push(
        <View
          key={`${currentChapterRef}-loader`}
          style={styles.darkContainer}
        ></View>
      );
    }
    return images;
  };

  if (isFetching) {
    return (
      <View style={styles.darkContainer}>
        <ActivityIndicator
          style={styles.spinner}
          size="large"
          color="#F0F8FF"
        />
      </View>
    );
  }

  const renderPagination = (index, total, context) => {
    if (index >= chaptersByChapterRef[currentChapterRef].length) {
      return null;
    }
    return (
      <View style={styles.paginationStyle}>
        <Text style={styles.paginationText}>
          <Text>{index + 1}</Text>/{total - 2}
        </Text>
      </View>
    );
  };

  const handleSwipeIndexChange = async (index) => {
    // account for 2 transition cards
    if (index == chaptersByChapterRef[currentChapterRef].length + 1) {
      await removePageItemAsyncStorage(currentChapterRef);
      const selectedChapterRefObject =
        selectedMangaDetail.chapterRefs[currentChapterIndex];
      // more chapters available
      if (selectedChapterRefObject.next != null) {
        const nextIndex = selectedMangaDetail.chapterRefs.findIndex(
          (element) => element.chapterRef === selectedChapterRefObject.next
        );
        saveChapterReadIfNeeded(
          selectedMangaDetail.mangaId,
          selectedChapterRefObject.next,
          nextIndex
        );
        fetchChapterIfNeeded(selectedChapterRefObject.next, nextIndex);
        saveChapterPageRead(
          selectedMangaDetail.mangaId,
          selectedChapterRefObject.next,
          0
        );
      } else {
        // go back to chapter screen if no more chapters
        navigation.goBack();
      }
    } else {
      saveChapterPageRead(
        selectedMangaDetail.mangaId,
        currentChapterRef,
        index
      );
    }
  };
  return (
    <View style={styles.container}>
      <Swiper
        key={currentChapterRef}
        renderPagination={renderPagination}
        showsButtons={true}
        loop={false}
        loadMinimal={true}
        loadMinimalSize={2}
        onIndexChanged={handleSwipeIndexChange}
        nextButton={renderNextButton()}
        prevButton={renderPrevButton()}
        index={
          selectedMangaDetail.latestChapterPage > 0
            ? selectedMangaDetail.latestChapterPage
            : 0
        }
      >
        {renderImages()}
      </Swiper>
      {/* <Overlay
        overlayStyle={styles.overlay}
        isVisible={visible}
        onBackdropPress={() => setVisible(false)}
      >
        <View style={styles.iconRow}>
          <TouchableOpacity
            onPress={() => {
              setVisible(false);
              navigation.goBack();
            }}
          >
            <Feather name="arrow-left-circle" size={36} color="white" />
            <Text style={{ textAlign: 'center', color: 'white' }}>Back</Text>
          </TouchableOpacity>
        </View>
      </Overlay> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  darkContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  spinner: {
    flex: 1,
  },
  chapterImage: {
    width: windowWidth,
    height: windowHeight,
    resizeMode: 'contain',
    backgroundColor: 'black',
  },
  paginationStyle: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  paginationText: {
    color: 'white',
    fontSize: 14,
  },
  overlay: {
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 50,
    elevation: 0,
  },
  iconRow: {
    flexDirection: 'row',
  },
  icons: {
    alignItems: 'center',
  },
  nextButton: {
    width: 40,
    height: windowHeight,
  },
});

const mapStateToProps = (state) => {
  return {
    isFetching: getChaptersFetchState(state),
    currentChapterRef: getCurrentChapterRef(state),
    currentChapterIndex: getCurrentChapterRefIndex(state),
    chaptersByChapterRef: getChaptersByChapterRef(state),
    selectedMangaDetail: getMangaById(state, state.select.selectedMangaId),
  };
};

export default connect(mapStateToProps, {
  fetchChapterIfNeeded,
  saveChapterReadIfNeeded,
  saveChapterPageRead,
})(MangaViewerScreen);
