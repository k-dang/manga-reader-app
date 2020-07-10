import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { connect } from 'react-redux';
import { addTodo } from '../store/todos/actions';
import { getTodos } from '../store/todos/selectors';

const AccountScreen = (props) => {
  const handleAdd = () => {
    props.addTodo('Hello world');
  };
  return (
    <View style={styles.container}>
      <Text>AccountScreen</Text>
      <Button title="Press me" onPress={handleAdd} />
      <Text>Hi, {props.todos.length}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = (state) => {
  return {
    todos: getTodos(state),
  };
};

export default connect(mapStateToProps, { addTodo })(AccountScreen);
