/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {View, TouchableOpacity} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

class ButtonWritePost extends Component {
  render() {
    const {goToPostView} = this.props;

    return (
      <View style={{zIndex: 1, position: 'absolute', bottom: 20, right: 20}}>
        <TouchableOpacity
          onPress={() => goToPostView()}
          style={{
            backgroundColor: '#027aff',
            width: 60,
            height: 60,
            borderRadius: 30,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Feather name="send" color={'white'} size={30} />
        </TouchableOpacity>
      </View>
    );
  }
}

export default ButtonWritePost;
