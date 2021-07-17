import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  Easing,
} from 'react-native';
import TransitionCard from '../components/TransitionCard';
import { removePageItemAsyncStorage } from '../services/asyncStorageHelpers';
import ImageViewer from 'react-native-image-zoom-viewer';

// store
import { connect } from 'react-redux';
import {
  getCurrentChapterRef,
  getCurrentChapterRefIndex,
  getChaptersFetchState,
  getChaptersByMangaId
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
  chapters,
  selectedMangaDetail,
  fetchChapterIfNeeded,
  saveChapterReadIfNeeded,
  saveChapterPageRead,
  navigation,
}) => {
  // useEffect(() => {
  //   StatusBar.setBarStyle('dark-content');
  //   return () => {
  //     // clean up effect
  //     StatusBar.setBarStyle('light-content');
  //   };
  // }, []);

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

  const transitionCard = () => {
    const selectedChapterRefObject =
      selectedMangaDetail.chapterRefs[currentChapterIndex];
    const nextChapterName = selectedMangaDetail.chapterRefs.find(
      (element) => element.chapterRef == selectedChapterRefObject.next
    )?.name;
    return (
      <TransitionCard
        key={`${currentChapterRef}-card`}
        finishedChapterName={selectedChapterRefObject.name}
        nextChapterName={nextChapterName}
      />
    );
  };

  const handleSwipeIndexChange = async (index) => {
    saveChapterPageRead(selectedMangaDetail.mangaId, currentChapterRef, index);
  };

  const handleChapterTransition = async () => {
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
  };

  const imageUrls = () => {
    // TODO add a previous transition card
    const images = chapters[currentChapterRef].map((element) => {
      return {
        width: windowWidth,
        height: windowHeight,
        url: element.url,
        props: {
          source: {
            headers: {
              Referer: `https://readmanganato.com`,
            },
          },
          style: {
            resizeMode: 'contain'
          }
        },
      };
    });

    if (images.length > 0) {
      images.push({
        isNextTransitionCard: true,
      });
    }
    return images;
  };

  return (
    <View style={styles.container}>
      <ImageViewer
        imageUrls={imageUrls()}
        enablePreload={true}
        pageAnimateTime={400}
        easingFunction={Easing.out(Easing.cubic)}
        renderArrowRight={renderNextButton}
        renderArrowLeft={renderPrevButton}
        onChange={handleSwipeIndexChange}
        useNativeDriver={true}
        index={
          selectedMangaDetail.latestChapterPage > 0
            ? selectedMangaDetail.latestChapterPage
            : 0
        }
        nextTransitionCard={transitionCard}
        onGoNextFail={handleChapterTransition}
        saveToLocalByLongPress={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  darkContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  spinner: {
    flex: 1,
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
    chapters: getChaptersByMangaId(state, state.select.selectedMangaId),
    selectedMangaDetail: getMangaById(state, state.select.selectedMangaId),
  };
};

export default connect(mapStateToProps, {
  fetchChapterIfNeeded,
  saveChapterReadIfNeeded,
  saveChapterPageRead,
})(MangaViewerScreen);
