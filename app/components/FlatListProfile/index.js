/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {View, Text, FlatList} from 'react-native';
import ItemFlatListPost from '../ItemFlatListPost';

class FlatListProfile extends Component {
  render() {
    const {data, getDataWithoutSend, props} = this.props;

    return (
      <FlatList
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
        }}
        data={data}
        renderItem={({item}) => (
          <ItemFlatListPost
            {...props}
            item={item}
            data={data}
            getData={getDataWithoutSend}
          />
        )}
        keyExtractor={(item) => `${item.idPost}`}
      />
    );
  }
}

export default FlatListProfile;
