import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';
import io from 'socket.io-client';

import WritePostView from '../views/WritePostView';
import PostView from '../views/PostView';
import WriteAnswerView from '../views/WriteAnswerView';

import DashboardView from '../views/DashboardView';
import faker from 'faker';

const MainStack = createStackNavigator();
const HomeStack = createStackNavigator();

export default class MyStack extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isConnect: false,
    };
  }
  componentDidMount() {
    this.socket = io('https://happear.herokuapp.com/');
    this.getUsername();
  }

  storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify({value});
      await AsyncStorage.setItem('username', jsonValue);
    } catch (e) {
      // saving error
    }
  };

  getUsername = async () => {
    try {
      const id = Math.floor(Math.random() * 300000000) + 1;
      AsyncStorage.getItem('username').then((post) => {
        const c = JSON.parse(post);

        if (!c) {
          var randomName = faker.name.findName();
          var avatar = faker.image.avatar();
          this.socket.emit('newuser', id);
          this.socket.on('newuser', (msg) => {
            if (msg.id === id) {
              console.log('plopineto');
              AsyncStorage.setItem(
                'username',
                JSON.stringify({username: randomName, idUser: msg.uid, avatar}),
              );
            }
          });
        } else {
          this.setState({isConnect: true});
        }
      });
    } catch (e) {
      // error reading value
    }
  };

  MainStackScreen = () => {
    return (
      <MainStack.Navigator headerMode="none">
        <MainStack.Screen name="Home" component={DashboardView} />
      </MainStack.Navigator>
    );
  };
  render() {
    const HomeNavigator = (
      <HomeStack.Navigator mode="modal" headerMode="none">
        <HomeStack.Screen name="Dashboard" component={this.MainStackScreen} />
        <HomeStack.Screen name="WritePost" component={WritePostView} />
        <HomeStack.Screen name="WriteAnswer" component={WriteAnswerView} />
      </HomeStack.Navigator>
    );

    return <NavigationContainer>{HomeNavigator}</NavigationContainer>;
  }
}
