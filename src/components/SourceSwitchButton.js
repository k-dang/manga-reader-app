import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Dimensions } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Overlay, ListItem, Icon, CheckBox } from 'react-native-elements';

// store
import { connect } from 'react-redux';
import { sources } from '../store/search/constants';
import { setSearchSource, searchManga } from '../store/search/actions';
import { getSearchSource, getSearchTerm } from '../store/search/selectors';

const windowWidth = Dimensions.get('window').width;

const SourceSwitchButton = ({
  source,
  searchTerm,
  setSearchSource,
  searchManga,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const { colors } = useTheme();

  return (
    <>
      <TouchableOpacity style={styles.icon} onPress={() => setIsVisible(true)}>
        <Icon
          reverse
          raised
          size={28}
          name="hexagon-multiple"
          type="material-community"
          color="#F7D1CD"
        />
      </TouchableOpacity>
      <Overlay
        isVisible={isVisible}
        onBackdropPress={() => setIsVisible(false)}
        windowBackgroundColor="rgba(255, 255, 255, .5)"
        overlayStyle={[styles.overlay, { backgroundColor: colors.background }]}
      >
        <View style={styles.overlayContainer}>
          <ListItem
            title="Select a source"
            titleStyle={{ color: colors.text }}
            containerStyle={{ backgroundColor: colors.background }}
          />
          <CheckBox
            title="MangaNato (default)"
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checked={source == sources.MANGANATO}
            onPress={() => {
              setSearchSource(sources.MANGANATO);
              if (searchTerm != '') {
                searchManga(searchTerm);
              }
            }}
            textStyle={{ color: colors.text }}
            containerStyle={{
              backgroundColor: colors.background,
              borderColor: 'transparent',
            }}
          />
          <CheckBox
            title="MangaDex"
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checked={source == sources.MANGADEX}
            onPress={() => {
              setSearchSource(sources.MANGADEX);
              if (searchTerm != '') {
                searchManga(searchTerm);
              }
            }}
            textStyle={{ color: colors.text }}
            containerStyle={{
              backgroundColor: colors.background,
              borderColor: 'transparent',
            }}
          />
          <ListItem containerStyle={{ backgroundColor: colors.background }} />
        </View>
      </Overlay>
    </>
  );
};

const styles = StyleSheet.create({
  icon: {
    position: 'absolute',
    bottom: 25,
    right: 25,
  },
  overlay: {
    alignItems: 'flex-start',
    position: 'absolute',
    bottom: 0,
    width: windowWidth,
  },
  overlayContainer: {
    alignSelf: 'stretch',
  },
});

const mapStateToProps = (state) => {
  return {
    source: getSearchSource(state),
    searchTerm: getSearchTerm(state),
  };
};

export default connect(mapStateToProps, { setSearchSource, searchManga })(
  SourceSwitchButton
);
