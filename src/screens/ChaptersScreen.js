import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import Ripple from 'react-native-material-ripple';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import { debounce } from 'lodash';
import { Overlay } from 'react-native-elements';
import ThemedView from '../components/ThemedView';

// store
import { connect } from 'react-redux';
import { getMangaById } from '../store/select/selectors';
import {
  reverseChapters,
  saveChapterReadIfNeeded,
  saveChaptersRead,
  saveChapterPageRead,
} from '../store/select/actions';
import { fetchChapterIfNeeded } from '../store/chapters/actions';

const windowWidth = Dimensions.get('window').width;

const ChaptersScreen = ({
  selectedMangaDetail,
  reverseChapters,
  fetchChapterIfNeeded,
  saveChapterReadIfNeeded,
  saveChaptersRead,
  saveChapterPageRead,
  navigation,
}) => {
  const [visible, setVisible] = useState(false);
  const [heldIndex, setHeldIndex] = useState(0);
  const { colors } = useTheme();
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.headerRight} onPress={toggleSort}>
          <MaterialCommunityIcons
            name="sort-numeric-variant"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
      ),
    });
  });

  const toggleSort = () => {
    reverseChapters(selectedMangaDetail.mangaId);
  };

  const handleMangaViewerNavigation = debounce(
    (chapterRef, index) => {
      saveChapterReadIfNeeded(selectedMangaDetail.mangaId, chapterRef, index);
      fetchChapterIfNeeded(chapterRef, index);
      saveChapterPageRead(selectedMangaDetail.mangaId, chapterRef, 0);
      navigation.navigate('MangaViewer');
    },
    1000,
    { leading: true, trailing: false }
  );

  const markReadBelow = () => {
    saveChaptersRead(selectedMangaDetail.mangaId, heldIndex);
    setVisible(false);
  };

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={selectedMangaDetail.chapterRefs}
        keyExtractor={(chapter) => chapter.chapterRef}
        renderItem={({ item, index }) => {
          return (
            <>
              <Ripple
                onPress={() => {
                  handleMangaViewerNavigation(item.chapterRef, index);
                }}
                rippleColor="rgb(211,211,211)"
                rippleOpacity={1}
                delayLongPress={500}
                onLongPress={() => {
                  setHeldIndex(index);
                  setVisible(true);
                }}
              >
                <View style={styles.row}>
                  <Text
                    style={[
                      styles.chapterTitle,
                      { color: colors.text },
                      item.hasRead ? styles.greyText : null,
                    ]}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={[
                      styles.date,
                      { color: colors.text },
                      item.hasRead ? styles.greyText : null,
                    ]}
                  >
                    {format(
                      parse(item.date, 'MMM dd,yyyy HH:mm', new Date()),
                      'MM/dd/yyyy'
                    )}
                  </Text>
                </View>
              </Ripple>
            </>
          );
        }}
      />
      <Overlay
        isVisible={visible}
        onBackdropPress={() => setVisible(false)}
        backdropStyle={styles.backdrop}
        overlayStyle={styles.overlay}
      >
        <View style={styles.iconRow}>
          <TouchableOpacity style={styles.icons} onPress={markReadBelow}>
            <MaterialIcons name="playlist-add-check" size={28} color="black" />
            <Text style={{ textAlign: 'center' }}>Below</Text>
          </TouchableOpacity>
        </View>
      </Overlay>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  chapterTitle: {
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
  },
  headerRight: {
    marginRight: 24,
  },
  greyText: {
    color: 'rgba(169,169,169, 0.5)',
  },
  backdrop: {
    backgroundColor: 'transparent',
  },
  overlay: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 50,
    width: windowWidth - 100,
  },
  iconRow: {
    flexDirection: 'row',
  },
  icons: {
    alignItems: 'center',
  },
});

const mapStateToProps = (state) => {
  return {
    selectedMangaDetail: getMangaById(state, state.select.selectedMangaId),
  };
};

export default connect(mapStateToProps, {
  reverseChapters,
  fetchChapterIfNeeded,
  saveChapterReadIfNeeded,
  saveChaptersRead,
  saveChapterPageRead,
})(ChaptersScreen);
