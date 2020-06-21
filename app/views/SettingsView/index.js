/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Header from '../../components/Header';

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

class SettingsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
    };
  }

  getData = async () => {
    AsyncStorage.getItem('posts').then((data) => {
      let retrieveData = data ? JSON.parse(data) : [];
      if (isEmpty(retrieveData)) {
        retrieveData = [];
      }
      this.setState({
        retrieveData,
      });
    });
  };

  deleteAllPost = () => {
    const c = [];
    AsyncStorage.setItem('posts', JSON.stringify(c));
    AsyncStorage.setItem('answer', JSON.stringify(c));
    AsyncStorage.setItem('username', JSON.stringify(null));
    this.getData();
  };
  render() {
    return (
      <View>
        <Header text="Settings" />
        <Button
          onPress={() => this.deleteAllPost()}
          title="Disappear"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
      </View>
    );
  }
}

export default SettingsView;
