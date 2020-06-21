/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {View, Text} from 'react-native';

class Header extends Component {
  render() {
    const {text} = this.props;

    return (
      <View
        style={{
          paddingTop: 15,
          backgroundColor: '#cbcbcc',
        }}>
        <View
          style={{
            height: 55,
            padding: 10,
            // flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontWeight: 'bold', fontSize: 20}}>{text}</Text>
        </View>
      </View>
    );
  }
}

export default Header;
