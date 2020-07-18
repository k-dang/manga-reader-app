import React, { useState } from 'react';
import { Dimensions } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { connect } from 'react-redux';
import { searchManga } from '../store/search/actions';
import { getSearchTerm } from '../store/search/selectors';

const HeaderSearchBar = ({ searchTerm, searchManga }) => {
  const [term, setTerm] = useState(searchTerm);

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
      }}
    />
  );
};

const mapStateToProps = (state) => {
  return {
    searchTerm: getSearchTerm(state),
  };
};

export default connect(mapStateToProps, { searchManga })(HeaderSearchBar);
