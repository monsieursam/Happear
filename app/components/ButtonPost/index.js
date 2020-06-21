/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

class ButtonCloseWritePost extends Component {
  render() {
    const {postMessage, text} = this.props;

    return (
      <View
        style={{
          zIndex: 1,
          position: 'absolute',
          right: 10,
          top: 20,
          backgroundColor: '#027aff',
          paddingLeft: 30,
          paddingRight: 30,
          paddingTop: 10,
          paddingBottom: 10,
          borderRadius: 15,
        }}>
        <TouchableOpacity onPress={() => postMessage()}>
          <Text style={{color: 'white'}}>{text}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default ButtonCloseWritePost;
