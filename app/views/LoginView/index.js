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

class LoginView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
    };
  }

  storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify({value});
      await AsyncStorage.setItem('username', jsonValue);
    } catch (e) {
      // saving error
    }
  };

  loginOnpress = () => {
    const {username} = this.state;
    const id = Math.floor(Math.random() * 300000000) + 1;

    this.storeData({username, id});
    this.props.navigation.navigate('Dashboard');
  };
  render() {
    return (
      <View>
        <Text>Login</Text>
        <TextInput
          onChangeText={(text) => this.setState({username: text})}
          value={this.state.username}
          placeholder="User Name"
        />
        <Button
          onPress={() => this.loginOnpress()}
          title="Login"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
      </View>
    );
  }
}

export default LoginView;
