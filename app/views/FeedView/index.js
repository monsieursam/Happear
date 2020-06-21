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
import {TouchableOpacity} from 'react-native-gesture-handler';
import ButtonWritePost from '../../components/ButtonWritePost';
import Header from '../../components/Header';
import ItemFlatListPost from '../../components/ItemFlatListPost';

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

class FeedView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chatMessage: '',
      chatMessages: [],
      retrieveData: [],
      data: [],
    };
  }
  componentDidMount() {
    this.getCurrentUser();
    this.socket = io('https://happear.herokuapp.com/');
    this.getData();
    let i = 0;
    this.socket.on('posts', (msg) => {
      const filterMessage = this.state.retrieveData.some((chatMessage) => {
        return chatMessage.idPost === msg.idPost;
      });
      const filterMessageReceive = this.state.chatMessages.some(
        (chatMessage) => {
          return chatMessage.idPost === msg.idPost;
        },
      );
      if (!filterMessage && !filterMessageReceive) {
        this.setState({chatMessages: [...this.state.chatMessages, msg]});
      }
    });
    this.socket.on('newco', (msg) => {
      this.getData();
    });

    // this.props.navigation.addListener('focus', this.getData);
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
      retrieveData.forEach((datas, index) => {
        this.socket.emit('posts', datas);
      });
    });
  };

  getCurrentUser = async () => {
    AsyncStorage.getItem('username').then((data) => {
      this.setState({
        currentUser: JSON.parse(data),
      });
    });
  };

  getDataWithoutSend = async () => {
    AsyncStorage.getItem('posts').then((data) => {
      const retrieveData = data ? JSON.parse(data) : [];

      this.setState({
        retrieveData,
      });
    });
  };

  combineSocketAndData = (data, chatMessages) => {
    if (isEmpty(data)) {
      data = [];
    }

    const arrayConcat = data.concat(chatMessages);

    arrayConcat.sort((a, b) => {
      var dateA = new Date(a.date),
        dateB = new Date(b.date);
      return dateB - dateA;
    });

    return arrayConcat;
  };

  goToPostView = () => {
    this.props.navigation.push('WritePost');
  };

  submitChatMessage() {
    this.socket.emit('posts', this.state.chatMessage);
    this.setState({chatMessage: ''});
  }

  render() {
    const {retrieveData, chatMessages, currentUser} = this.state;

    const data = this.combineSocketAndData(retrieveData, chatMessages);

    return (
      <View style={{flex: 1}}>
        <Header text="Feed" />
        {data && (
          <FlatList
            style={{
              zIndex: 0,
              width: '100%',
              height: '100%',
            }}
            data={data}
            renderItem={({item}) => (
              <ItemFlatListPost
                {...this.props}
                item={item}
                data={data}
                getData={this.getDataWithoutSend}
                currentUser={this.state.currentUser}
              />
            )}
            keyExtractor={(item) => `${item.idPost}`}
          />
        )}
        <ButtonWritePost goToPostView={this.goToPostView} />
      </View>
    );
  }
}

export default FeedView;
