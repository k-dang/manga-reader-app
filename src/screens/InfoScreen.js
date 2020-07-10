import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import ErrorContainer from '../components/ErrorContainer';
import { connect } from 'react-redux';
import {
  getSelectedManga,
  getSelectFetchState,
  getMangaByTitle,
  getSelectError,
} from '../store/select/selectors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const InfoScreen = ({
  isFetching,
  selectedManga,
  selectedMangaDetail,
  error,
  navigation,
}) => {
  useEffect(() => {
    navigation.setOptions({ title: selectedManga });
  });

  const [favourite, setFavourite] = useState(false);
  const handleChapterListNavigation = () => {
    navigation.navigate('Chapters');
  };

  const favouriteIconName = favourite ? 'heart' : 'heart-outline';
  const toggleFavourite = () => {
    setFavourite(!favourite);
  };

  const iconColor = 'black';

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
    <ScrollView style={styles.container}>
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
          <TouchableOpacity style={styles.icons}>
            <MaterialCommunityIcons
              name="play-outline"
              size={36}
              color={iconColor}
            />
            <Text style={{ color: iconColor }}>Read</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.icons}
            onPress={handleChapterListNavigation}
          >
            <MaterialCommunityIcons
              name="format-list-bulleted"
              size={36}
              color={iconColor}
            />
            <Text style={{ color: iconColor }}>Chapters</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.icons} onPress={toggleFavourite}>
            <MaterialCommunityIcons
              name={favouriteIconName}
              size={36}
              color={iconColor}
            />
            <Text style={{ color: iconColor }}>Favourite</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.textBold]}>About</Text>
        <Text>{selectedMangaDetail.cleanedDescription}</Text>
      </View>
    </ScrollView>
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
  divider: {
    borderLeftWidth: 2,
    borderLeftColor: 'whitesmoke',
    borderRadius: 8,
  },
  textBold: {
    fontWeight: 'bold',
  },
});

const mapStateToProps = (state) => {
  return {
    selectedManga: getSelectedManga(state),
    isFetching: getSelectFetchState(state),
    selectedMangaDetail: getMangaByTitle(state, state.select.selectedManga),
    error: getSelectError(state),
  };
};

export default connect(mapStateToProps)(InfoScreen);
