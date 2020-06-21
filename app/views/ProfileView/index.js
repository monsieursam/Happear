/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import io from 'socket.io-client';
import {TouchableOpacity} from 'react-native-gesture-handler';
import HeaderGoBack from '../../components/HeaderGoBack';
import ItemFlatListPost from '../../components/ItemFlatListPost';
import TabViewProfile from '../../components/TabViewProfile';

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
      retrieveDataAnswer: [],
      chatMessagesAnswer: [],
      data: [],
    };
  }
  componentDidMount() {
    const {item} = this.props.route.params;
    this.socket = io('https://happear.herokuapp.com/');
    this.socket.emit('answernewco', 'je suis un chaton');

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
        item.user.idUser === msg.user.idUser
      ) {
        this.setState({chatMessages: [...this.state.chatMessages, msg]});
      }
    });
    this.socket.on('answer', (msg) => {
      const filterMessage = this.state.retrieveDataAnswer.some(
        (chatMessage) => {
          return chatMessage.idPost === msg.idPost;
        },
      );
      const filterMessageReceive = this.state.chatMessagesAnswer.some(
        (chatMessage) => {
          return chatMessage.idPost === msg.idPost;
        },
      );

      if (
        !filterMessage &&
        !filterMessageReceive &&
        item.user.idUser === msg.user.idUser
      ) {
        this.setState({
          chatMessagesAnswer: [...this.state.chatMessagesAnswer, msg],
        });
      }
    });
    this.socket.on('newco', (msg) => {
      this.getData();
    });
    this.socket.on('newcoonprofile', (msg) => {
      this.getData();
    });

    // this.props.navigation.addListener('focus', this.getData);
  }
  getData = async () => {
    const {item} = this.props.route.params;

    AsyncStorage.getItem('posts').then((data) => {
      let retrieveData = data ? JSON.parse(data) : [];
      if (isEmpty(retrieveData)) {
        retrieveData = [];
      }
      retrieveData = retrieveData.filter(
        (datas) => datas.user.idUser === item.user.idUser,
      );
      this.setState({
        retrieveData,
      });
      retrieveData.forEach((datas, index) => {
        this.socket.emit('posts', datas);
      });
    });
  };

  getDataAnswer = async () => {
    const {item} = this.props.route.params;

    AsyncStorage.getItem('answers').then((data) => {
      let retrieveData = data ? JSON.parse(data) : [];
      if (isEmpty(retrieveData)) {
        retrieveData = [];
      }
      retrieveData = retrieveData.filter(
        (datas) => datas.user.idUser === item.user.idUser,
      );
      this.setState({
        retrieveData,
      });
      retrieveData.forEach((datas, index) => {
        this.socket.emit('answers', datas);
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

    console.log('arrayconact');
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

  followProfile = () => {
    const {item} = this.props.route.params;
    var date = new Date();

    AsyncStorage.getItem('follow').then((post) => {
      const c = post ? JSON.parse(post) : [];
      c.push({
        idUser: item.user.idUser,
        date,
      });
      AsyncStorage.setItem('follow', JSON.stringify(c));
      const socket = io(`https://happear.herokuapp.com/`);
      socket.emit(item.user.idUser, {
        idUser: item.user.idUser,
        date,
      });
    });
  };

  render() {
    const {chatMessages, chatMessagesAnswer} = this.state;

    const dataPosts = chatMessages;

    console.log('kast data');
    console.log(dataPosts);
    let Image_Http_URL = null;
    let userName = null;
    if (dataPosts && dataPosts[0]) {
      Image_Http_URL = {uri: dataPosts[0].user.avatar};
      userName = dataPosts[0].user.username;
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

    const ViewAnswerFlatList = () => (
      <View style={{height: '100%'}}>
        {chatMessagesAnswer && (
          <FlatList
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
              paddingBottom: 80,
            }}
            data={chatMessagesAnswer}
            renderItem={({item}) => (
              <ItemFlatListPost
                {...this.props}
                item={item}
                data={chatMessagesAnswer}
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
        <HeaderGoBack
          text={userName}
          goBack={() => this.props.navigation.goBack()}
        />
        <View
          style={{height: 150, justifyContent: 'center', alignItems: 'center'}}>
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
          <View style={{margin: 20}}>
            {userName && (
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>{userName}</Text>
            )}
          </View>
        </View>
        <TabViewProfile views={views} />
      </View>
    );
  }
}

export default FeedView;
