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

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}
class Item extends Component {
  goToPostView = () => {
    this.props.navigation.navigate('Post', this.props);
  };
  render() {
    const {item} = this.props;
    if (!item.user) {
      return null;
    }
    let Image_Http_URL = {uri: item.user.avatar};
    return (
      <TouchableOpacity onPress={() => this.goToPostView()}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '90%',
            margin: 10,
          }}>
          <Image
            source={Image_Http_URL}
            style={{
              height: 50,
              width: 50,
              borderRadius: 5,
              resizeMode: 'stretch',
            }}
          />
          <View
            style={{
              marginLeft: 20,
              marginRight: 10,
              width: '80%',
            }}>
            <Text style={{width: '100%', flexGrow: 1, flex: 1}}>
              {item.user.username}
            </Text>
            <Text style={{width: '100%', flexGrow: 1, flex: 1}}>
              {item.message}
            </Text>
            {/* {item.idUser === currentUser.idUser && (
            <Button title="Delete" onPress={() => this.deleteOnePost()} />
          )} */}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

class FeedView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chatMessage: '',
      chatMessages: [],
      retrieveData: [],
      data: [],
      currentUser: {},
    };
  }
  componentDidMount() {
    this.getCurrentUser();
    this.getFollow();

    const sockets = [];
    // this.state.retrieveData.map((data) => {
    //   sockets.push(io(`http://localhost:3012/users/${data.idUser}`));
    // });

    this.socket = io('http://localhost:3012/users/:iduser');
    // // this.socket.on('plopi', (msg) => {
    // //   console.log('plopi');
    // // });
    this.socket.emit('newposts', {plop: 'plopi'});

    // sockets.forEach((socket) => {
    //   socket.on('posts', (msg) => {
    //     const filterMessage = this.state.retrieveData.some((chatMessage) => {
    //       return chatMessage.idPost === msg.idPost;
    //     });
    //     const filterMessageReceive = this.state.chatMessages.some(
    //       (chatMessage) => {
    //         return chatMessage.idPost === msg.idPost;
    //       },
    //     );
    //     if (!filterMessage && !filterMessageReceive) {
    //       this.setState({chatMessages: [...this.state.chatMessages, msg]});
    //     }
    //   });
    // });
    // this.socket = io({http://localhost:3012/users/${this.state.currentUser.idUser}});
    // this.props.navigation.addListener('focus', this.getData);
  }

  getFollow = async () => {
    AsyncStorage.getItem('follow').then((data) => {
      let retrieveData = data ? JSON.parse(data) : [];
      if (isEmpty(retrieveData)) {
        retrieveData = [];
      }
      this.setState({
        retrieveData,
      });
    });
  };

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

    console.log('kast data');
    console.log(data);
    return (
      <View>
        <Text>ProfileView</Text>
        <Button
          onPress={() => this.goToPostView()}
          title="Post"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
        {data && (
          <FlatList
            style={{
              width: '100%',
              height: '100%',
            }}
            data={data}
            renderItem={({item}) => (
              <Item
                {...this.props}
                item={item}
                data={data}
                getData={this.getDataWithoutSend}
              />
            )}
            keyExtractor={(item) => `${item.idPost}`}
          />
        )}
      </View>
    );
  }
}

export default FeedView;
