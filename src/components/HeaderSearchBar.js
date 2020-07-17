import React, { useState } from 'react';
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
      inputContainerStyle={{ height: 30 }}
    />
  );
};

const mapStateToProps = (state) => {
  return {
    searchTerm: getSearchTerm(state),
  };
};

export default connect(mapStateToProps, { searchManga })(HeaderSearchBar);
