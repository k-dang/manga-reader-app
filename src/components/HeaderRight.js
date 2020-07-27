import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Overlay, ListItem } from 'react-native-elements';

// store
import { connect } from 'react-redux';
import { loadLibraryAndSelect, setSortType } from '../store/library/actions';
import { getUserId } from '../store/account/selectors';
import { getSortType } from '../store/library/selectors';
import { sort } from '../store/library/constants';

const windowWidth = Dimensions.get('window').width;

const HeaderRight = ({
  userId,
  loadLibraryAndSelect,
  setSortType,
  sortType,
}) => {
  const { colors } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [checked, setChecked] = useState(false);

  const unreadSortIcon =
    sortType === sort.UNREAD_DESC ? 'arrow-down' : 'arrow-up';

  const handleRefresh = () => {
    // loadLibraryAndSelect(userId);
    console.log('refresh');
  };

  const handleFilter = () => {
    setIsVisible(true);
  };

  const toggleUnreadSort = () => {
    setSortType(
      sortType === sort.UNREAD_DESC ? sort.UNREAD_ASC : sort.UNREAD_DESC
    );
  };

  return (
    <>
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.icons} onPress={handleFilter}>
          <MaterialCommunityIcons
            name="filter-variant"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icons} onPress={handleRefresh}>
          <MaterialCommunityIcons
            name="refresh"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>
      <Overlay
        isVisible={isVisible}
        onBackdropPress={() => setIsVisible(false)}
        windowBackgroundColor="rgba(255, 255, 255, .5)"
        overlayStyle={[styles.overlay, { backgroundColor: colors.background }]}
      >
        <View style={styles.overlayContainer}>
          <ListItem
            title="Sort by"
            titleStyle={{ color: colors.text }}
            containerStyle={{ backgroundColor: colors.background }}
          />
          <ListItem
            title="Unread"
            titleStyle={{ color: colors.text }}
            containerStyle={{ backgroundColor: colors.background }}
            leftIcon={{
              name: unreadSortIcon,
              type: 'feather',
              size: 26,
              color: colors.text,
            }}
            onPress={toggleUnreadSort}
          />
        </View>
      </Overlay>
    </>
  );
};

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
    marginRight: 24,
  },
  icons: {
    marginLeft: 30,
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
    userId: getUserId(state),
    sortType: getSortType(state),
  };
};

export default connect(mapStateToProps, { loadLibraryAndSelect, setSortType })(
  HeaderRight
);
