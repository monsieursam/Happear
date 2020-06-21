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
import ItemFlatListPost from '../../components/ItemFlatListPost';
import ButtonWritePost from '../../components/ButtonWritePost';
import Header from '../../components/Header';
import TabViewProfile from '../../components/TabViewProfile';
import ItemFlatListAnswer from '../../components/ItemFlatListAnswer';

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
      retrieveDataAnswers: [],
      chatMessagesAnswers: [],
      data: [],
      currentUser: {},
    };
  }
  componentDidMount() {
    this.socket = io('https://happear.herokuapp.com/');
    this.getData();
    this.getCurrentUser();
    this.socket.on('posts', (msg) => {
      const filterMessage = this.state.retrieveData.some((chatMessage) => {
        return chatMessage.idPost === msg.idPost;
      });
      const filterMessageReceive = this.state.chatMessages.some(
        (chatMessage) => {
          return chatMessage.idPost === msg.idPost;
        },
      );

      if (
        !filterMessage &&
        !filterMessageReceive &&
        this.state.currentUser.idUser === msg.user.idUser
      ) {
        this.setState({chatMessages: [...this.state.chatMessages, msg]});
      }
    });

    this.socket.on('answer', (msg) => {
      const filterMessage = this.state.retrieveDataAnswers.some(
        (chatMessage) => {
          return chatMessage.idPost === msg.idPost;
        },
      );
      const filterMessageReceive = this.state.chatMessagesAnswers.some(
        (chatMessage) => {
          return chatMessage.idPost === msg.idPost;
        },
      );

      if (
        !filterMessage &&
        !filterMessageReceive &&
        this.state.currentUser.idUser === msg.user.idUser
      ) {
        this.setState({
          chatMessagesAnswers: [...this.state.chatMessagesAnswers, msg],
        });
      }
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
    });

    AsyncStorage.getItem('answer').then((data) => {
      let retrieveData = data ? JSON.parse(data) : [];
      if (isEmpty(retrieveData)) {
        retrieveData = [];
      }
      console.log(retrieveData);
      this.setState({
        retrieveDataAnswers: retrieveData,
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

    console.log('array concat du plopinet');
    console.log(arrayConcat);

    return arrayConcat;
  };

  goToPostView = () => {
    this.props.navigation.push('WritePost');
  };

  submitChatMessage() {
    this.socket.emit('posts', this.state.chatMessage);
    this.setState({chatMessage: ''});
  }

  goToPostView = () => {
    this.props.navigation.push('WritePost');
  };

  render() {
    const {
      retrieveData,
      chatMessages,
      currentUser,
      retrieveDataAnswers,
      chatMessagesAnswers,
    } = this.state;

    const dataPosts = this.combineSocketAndData(retrieveData, chatMessages);
    const dataAnswers = this.combineSocketAndData(
      retrieveDataAnswers,
      chatMessagesAnswers,
    );

    let Image_Http_URL = null;
    let userName = null;
    if (currentUser) {
      Image_Http_URL = {uri: currentUser.avatar};
      userName = currentUser.username;
    }

    const ViewPostFlatList = () => (
      <View style={{height: '100%'}}>
        {dataPosts && (
          <FlatList
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
              paddingBottom: 80,
            }}
            data={dataPosts}
            renderItem={({item}) => (
              <ItemFlatListPost
                {...this.props}
                item={item}
                data={dataPosts}
                getData={this.getDataWithoutSend}
              />
            )}
            keyExtractor={(item) => `${item.idPost}`}
          />
        )}
      </View>
    );

    console.log(dataAnswers);

    const ViewAnswerFlatList = () => (
      <View style={{height: '100%'}}>
        {dataAnswers && (
          <FlatList
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
              paddingBottom: 80,
            }}
            data={dataAnswers}
            renderItem={({item}) => (
              <ItemFlatListAnswer
                {...this.props}
                item={item}
                data={dataAnswers}
                getData={this.getDataWithoutSend}
              />
            )}
            keyExtractor={(item) => `${item.idPost}`}
          />
        )}
      </View>
    );

    const views = {
      first: ViewPostFlatList,
      second: ViewAnswerFlatList,
    };

    return (
      <View style={{flex: 1}}>
        <View
          style={{height: 200, justifyContent: 'center', alignItems: 'center'}}>
          {Image_Http_URL && (
            <Image
              source={Image_Http_URL}
              style={{
                height: 100,
                width: 100,
                borderRadius: 5,
                resizeMode: 'stretch',
                borderRadius: 50,
              }}
            />
          )}
          <View style={{marginTop: 30}}>
            {userName && (
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>{userName}</Text>
            )}
          </View>
        </View>
        <TabViewProfile views={views} />
        <ButtonWritePost goToPostView={this.goToPostView} />
      </View>
    );
  }
}

export default FeedView;
