import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  FlatList,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { connect } from 'react-redux';
import {
  getCurrentChapterRef,
  getChapterByRef,
  getChaptersFetchState,
} from '../store/chapters/selectors';
import axios from 'axios';
import { Dimensions } from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const MangaViewerScreen = ({ isFetching, chapterImages, chapterRef }) => {
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

  const addReferer = chapterImages;
  addReferer.forEach((element) => {
    element.props = {
      source: {
        headers: {
          Referer: `https://manganelo.com/chapter/${chapterRef}`,
        },
      },
      style: {
        resizeMode: 'contain',
      },
    };
    (element.width = windowWidth), (element.height = windowHeight);
  });

  return (
    <View style={styles.container}>
      {/* <ImageViewer
        imageUrls={addReferer}
        loadingRender={() => (
          <ActivityIndicator
            style={styles.spinner}
            size="large"
            color="#f0ffff"
          />
        )}
      /> */}
      <Image
        source={{
          uri: `${chapterImages[0].url}`,
          headers: {
            Referer: `https://manganelo.com/chapter${chapterRef}`,
          },
        }}
        style={{ width: windowWidth, height: windowHeight }}
        onError={(err) => {
          console.log(err.nativeEvent);
        }}
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
    chapterImages: getChapterByRef(state, state.chapters.currentChapterRef),
    isFetching: getChaptersFetchState(state),
    chapterRef: getCurrentChapterRef(state),
  };
};

export default connect(mapStateToProps)(MangaViewerScreen);
