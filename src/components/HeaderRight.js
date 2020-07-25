import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// store
import { connect } from 'react-redux';
import { loadLibraryAndSelect } from '../store/library/actions';
import { getUserId } from '../store/account/selectors';

const HeaderRight = ({ userId, loadLibraryAndSelect }) => {
  const { colors } = useTheme();

  const handleRefresh = () => {
    loadLibraryAndSelect(userId);
  };
  
  const handleFilter = () => {
    console.log('filter');
  };

  return (
    <View style={styles.headerRight}>
      <TouchableOpacity style={styles.icons} onPress={() => handleFilter()}>
        <MaterialCommunityIcons
          name="filter-variant"
          size={24}
          color={colors.text}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.icons} onPress={() => handleRefresh()}>
        <MaterialCommunityIcons name="refresh" size={24} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
    marginRight: 24,
  },
  icons: {
    marginLeft: 20,
  },
});

const mapStateToProps = (state) => {
  return {
    userId: getUserId(state),
  };
};

export default connect(mapStateToProps, { loadLibraryAndSelect })(HeaderRight);
