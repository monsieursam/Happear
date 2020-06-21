/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {View, TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

class ButtonCloseWritePost extends Component {
  render() {
    const {closeWriteView} = this.props;

    return (
      <View style={{zIndex: 1, position: 'absolute', left: 10, top: 10}}>
        <TouchableOpacity
          onPress={() => closeWriteView()}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <AntDesign name="close" color={'#027aff'} size={30} />
        </TouchableOpacity>
      </View>
    );
  }
}

export default ButtonCloseWritePost;
