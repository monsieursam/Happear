/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import NavigationStack from './routes/NavigationStack';
import AsyncStorage from '@react-native-community/async-storage';
import io from 'socket.io-client';

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

class App extends Component {
  componentDidMount() {
    this.socket = io('https://happear.herokuapp.com/');
    this.socket.on('newco', (msg) => {
      this.sendData();
    });
    this.socket.on('answernewco', (msg) => {
      this.sendData();
    });
    this.socket.on('newcoonprofile', (msg) => {
      this.sendData();
    });

    this.socket.emit(
      'newco',
      'je suis une nouvelle connexion sur lapp et je souhaite les datas',
    );
    this.socket.emit('answernewco', 'je suis une nouvelle connexion');
  }

  sendData = async () => {
    AsyncStorage.getItem('posts').then((data) => {
      let retrieveData = data ? JSON.parse(data) : [];
      if (isEmpty(retrieveData)) {
        retrieveData = [];
      }
      retrieveData.forEach((datas, index) => {
        this.socket.emit('posts', datas);
      });
    });
    AsyncStorage.getItem('answer').then((data) => {
      let retrieveData = data ? JSON.parse(data) : [];
      if (isEmpty(retrieveData)) {
        retrieveData = [];
      }
      retrieveData.forEach((datas, index) => {
        this.socket.emit('answer', datas);
      });
    });
  };
  render() {
    return <NavigationStack />;
  }
}

export default App;
