import React, { useState } from 'react';
import { Dimensions } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { SearchBar } from 'react-native-elements';

// store
import { connect } from 'react-redux';
import { searchManga } from '../store/search/actions';
import { getSearchTerm } from '../store/search/selectors';

const HeaderSearchBar = ({ searchTerm, searchManga }) => {
  const [term, setTerm] = useState(searchTerm);
  const { colors } = useTheme();
  const handleSearch = () => {
    searchManga(term);
  };

  return (
    <SearchBar
      placeholder="Search..."
      value={term}
      onChangeText={(text) => setTerm(text)}
      onEndEditing={() => handleSearch()}
      platform="android"
      inputContainerStyle={{
        height: 20,
        width: Dimensions.get('window').width - 25,
        backgroundColor: colors.background,
      }}
      inputStyle={{
        color: colors.text,
        backgroundColor: colors.background,
      }}
      placeholderTextColor="#9a9a9a"
      containerStyle={{
        backgroundColor: colors.background,
        // width: Dimensions.get('window').width - 25,
      }}
      searchIcon={{ color: colors.text }}
      cancelIcon={{ color: colors.text }}
    />
  );
};

const mapStateToProps = (state) => {
  return {
    searchTerm: getSearchTerm(state),
  };
};

export default connect(mapStateToProps, { searchManga })(HeaderSearchBar);
