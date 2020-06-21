/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {View, Text, Button, FlatList, TextInput, Image} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import io from 'socket.io-client';

import ButtonCloseWritePost from '../../components/ButtonCloseWritePost';
import ButtonPost from '../../components/ButtonPost';

class FeedView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
    };
  }

  componentDidMount() {
    this.socket = io('https://happear.herokuapp.com/');
    this.getCurrentUser();
  }

  getCurrentUser = async () => {
    AsyncStorage.getItem('username').then((data) => {
      this.setState({
        currentUser: JSON.parse(data),
      });
    });
  };

  storeData = async (value) => {
    const {message} = this.state;
    const id = Math.floor(Math.random() * 300000000) + 1;
    var date = new Date();

    AsyncStorage.getItem('posts').then((post) => {
      const c = post ? JSON.parse(post) : [];
      this.socket.on('newposts', (msg) => {
        if (msg.id === id) {
          const newPost = {
            idPost: msg.uid,
            message,
            date,
            user: {...this.state.currentUser},
          };
          c.push(newPost);
          AsyncStorage.setItem('posts', JSON.stringify(c));
          this.socket.emit('posts', newPost);
        }
      });
      this.socket.emit('newposts', id);
    });
  };

  postMessage = () => {
    if (this.state.message !== '' && this.state.message.length < 200) {
      this.storeData();
      this.props.navigation.goBack();
    }
  };
  render() {
    return (
      <View>
        <ButtonCloseWritePost
          closeWriteView={() => this.props.navigation.goBack()}
        />
        <ButtonPost postMessage={this.postMessage} text={'Post'} />
        <View
          style={{
            marginTop: 50,
            paddingLeft: 30,
            paddingTop: 20,
            paddingRight: 40,
          }}>
          <TextInput
            onChangeText={(text) => this.setState({message: text})}
            value={this.state.message}
            placeholder="Make it appear"
            multiline={true}
            numberOfLines={4}
            style={{height: 200, borderColor: 'gray', fontSize: 20}}
          />
        </View>
      </View>
    );
  }
}

export default FeedView;
