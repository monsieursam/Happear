import React, {Component} from 'react';
import {View, Text, Button, FlatList, TextInput, Image} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import io from 'socket.io-client';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Header from '../../components/Header';

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}
class Item extends Component {
  deleteOnePost = () => {
    const {item} = this.props;
    const c = this.props.data.filter((data) => data.idPost !== item.idPost);

    AsyncStorage.setItem('posts', JSON.stringify(c));
  };

  goToPostView = () => {
    this.props.navigation.navigate('Post', this.props);
  };
  render() {
    const {item} = this.props;

    let Image_Http_URL = {uri: item.user.avatar};
    return (
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
    );
  }
}

export default class Post extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chatMessages: [],
      retrieveData: [],
      data: [],
      message: '',
    };
  }

  componentDidMount() {
    this.getCurrentUser();
    this.socket = io('https://happear.herokuapp.com/', {
      transports: ['websocket'],
      upgrade: false,
    });
    this.socket.emit('answernewco', 'je suis un chaton');

    this.socket.on('answernewco', (msg) => {
      this.setState({newstate: 'plop'});
    });
    this.socket.on('answer', (msg) => {
      console.log('je recois une soccket');
      console.log(msg);
      const filterMessage = this.state.retrieveData.some((chatMessage) => {
        return chatMessage.idAnswer === msg.idAnswer;
      });
      const filterMessageReceive = this.state.chatMessages.some(
        (chatMessage) => {
          return chatMessage.idAnswer === msg.idAnswer;
        },
      );

      const filterMessageCroix = this.state.retrieveData.some((data) => {
        const croice = this.state.chatMessages.some((data2) => {
          console.log(data.idAnswer);
          console.log(data2.idAnswer);
          if (data.idAnswer === data2.idAnswer) {
            return true;
          }
        });
        console.log('croice juste en dessous');
        console.log(croice);
        return croice;
      });
      console.log(filterMessageCroix);

      if (
        !filterMessage &&
        !filterMessageReceive &&
        !filterMessageCroix &&
        msg.idUser === this.state.currentUser.idUser &&
        msg.user.idUser !== this.state.currentUser.idUser
      ) {
        this.setState({chatMessages: [...this.state.chatMessages, msg]});
      }
    });

    // this.props.navigation.addListener('focus', this.getData);
  }

  emitData = (array) => {
    array.forEach((datas, index) => {
      console.log('emit socket');
      this.socket.emit('answer', datas);
    });
  };

  storeData = async (value) => {
    const {message, currentUser} = this.state;
    const {item} = this.props.route.params;
    const {idPost} = item;
    const id = Math.floor(Math.random() * 300000000) + 1;
    var date = new Date();

    AsyncStorage.getItem('answer').then((post) => {
      const c = post ? JSON.parse(post) : [];
      c.push({
        idPost: item.idPost,
        idAnswer: id,
        message,
        date,
        user: {...currentUser},
      });
      AsyncStorage.setItem('answer', JSON.stringify(c));

      this.socket.emit('answer', {
        idPost: item.idPost,
        idAnswer: id,
        message,
        date,
        user: {...currentUser},
      });
    });
  };

  postMessage = () => {
    if (this.state.message !== '' && this.state.message.length < 200) {
      this.storeData();
      this.setState({
        message: '',
      });
    }
  };

  getCurrentUser = async () => {
    AsyncStorage.getItem('username').then((data) => {
      this.setState({
        currentUser: JSON.parse(data),
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

  deleteOnePost = () => {
    const {item} = this.props;
    const c = this.props.data.filter((data) => data.idPost !== item.idPost);

    AsyncStorage.setItem('posts', JSON.stringify(c));
  };

  goToProfile = () => {
    const {item} = this.props.route.params;

    this.props.navigation.navigate('Profile', {item});
  };
  render() {
    const {retrieveData, chatMessages, currentUser} = this.state;

    const data = this.combineSocketAndData(retrieveData, chatMessages);

    return (
      <View style={{}}>
        <Header text="Notification" />
        <FlatList
          style={{
            marginTop: 10,
            width: '100%',
          }}
          data={data}
          renderItem={({item}) => (
            <Item
              {...this.props}
              item={item}
              data={data}
              getData={this.getDataWithoutSend}
              currentUser={currentUser}
            />
          )}
          keyExtractor={(item) => `${item.idAnswer}`}
        />
      </View>
    );
  }
}
