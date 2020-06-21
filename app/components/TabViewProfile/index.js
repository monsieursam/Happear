import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {TabView, SceneMap} from 'react-native-tab-view';

const initialLayout = {width: Dimensions.get('window').width};

function TabViewProfile(props) {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: 'Posts'},
    {key: 'second', title: 'Answers'},
  ]);

  const renderScene = SceneMap({
    first: props.views.first,
    second: props.views.second,
  });

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
    />
  );
}

export default TabViewProfile;
