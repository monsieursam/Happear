import React, {Component} from 'react';
import {View, Text, Image} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {TouchableOpacity} from 'react-native-gesture-handler';
import moment from 'moment';

class ItemFlatListPost extends Component {
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
            <View
              style={{
                width: '100%',
                height: 50,
                justifyContent: 'center',
                marginBottom: 10,
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                }}>
                {item.user.username}
              </Text>
              <Text>{moment(item.date).fromNow()}</Text>
            </View>
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

export default ItemFlatListPost;
