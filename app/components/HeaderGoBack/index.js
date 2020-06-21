/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

class HeaderGoBack extends Component {
  render() {
    const {goBack, text} = this.props;

    return (
      <View
        style={{
          paddingTop: 15,
        }}>
        <View
          style={{
            padding: 10,
            // flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={() => goBack()}>
            <View>
              <SimpleLineIcons name="arrow-left" size={20} />
            </View>
          </TouchableOpacity>
          <View></View>
          <View></View>
        </View>
      </View>
    );
  }
}

export default HeaderGoBack;
