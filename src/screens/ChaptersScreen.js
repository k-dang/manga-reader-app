import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { FlatList } from 'react-native-gesture-handler';
import Ripple from 'react-native-material-ripple';
import { getMangaByTitle, getSelectedManga } from '../store/select/selectors';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { reverseChapters } from '../store/select/actions';
import { fetchChapterIfNeeded } from '../store/chapters/actions';

const ChaptersScreen = ({
  selectedManga,
  selectedMangaDetail,
  reverseChapters,
  fetchChapterIfNeeded,
  navigation,
}) => {
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.headerRight} onPress={toggleSort}>
          <MaterialCommunityIcons name="sort-numeric" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  });

  const toggleSort = () => {
    reverseChapters(selectedManga);
  };

  const handleMangaViewerNavigation = (chapterRef, index) => {
    fetchChapterIfNeeded(chapterRef, index);
    navigation.navigate('MangaViewer');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={selectedMangaDetail.chapterRefs}
        keyExtractor={(chapter) => chapter.chapterRef}
        renderItem={({ item, index }) => {
          return (
            <>
              <Ripple
                onPress={() =>
                  handleMangaViewerNavigation(item.chapterRef, index)
                }
              >
                <View style={styles.row}>
                  <Text style={[styles.chapterTitle]}>{item.name}</Text>
                  <Text style={[styles.date]}>
                    {format(
                      parse(item.date, 'MMM dd,yyyy HH:mm', new Date()),
                      'MM/dd/yyyy'
                    )}
                  </Text>
                </View>
              </Ripple>
              <View style={styles.seperator}></View>
            </>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  row: {
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  seperator: {
    borderColor: 'lightgrey',
    borderTopWidth: 1,
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
});

const mapStateToProps = (state) => {
  return {
    selectedMangaDetail: getMangaByTitle(state, state.select.selectedManga),
    selectedManga: getSelectedManga(state),
  };
};

export default connect(mapStateToProps, {
  reverseChapters,
  fetchChapterIfNeeded,
})(ChaptersScreen);
