/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import FeedView from '../FeedView';
import MyProfileView from '../MyProfileView';
import NotificationView from '../NotificationView';
import SettingsView from '../SettingsView';
import PostView from '../PostView';
import ProfileView from '../ProfileView';

const Tab = createBottomTabNavigator();
const FeedStack = createStackNavigator();

function FeedNavigator() {
  return (
    <FeedStack.Navigator headerMode="none">
      <FeedStack.Screen name="FeedView" component={FeedView} />
      <FeedStack.Screen name="Post" component={PostView} />
      <FeedStack.Screen name="Profile" component={ProfileView} />
    </FeedStack.Navigator>
  );
}

function ProfileNavigator() {
  return (
    <FeedStack.Navigator headerMode="none">
      <FeedStack.Screen name="MyProfile" component={MyProfileView} />
      <FeedStack.Screen name="Post" component={PostView} />
      <FeedStack.Screen name="Profile" component={ProfileView} />
    </FeedStack.Navigator>
  );
}

function MyTabs() {
  return (
    <Tab.Navigator>
      {/* <Tab.Screen
        name="Home"
        component={HomeView}
        options={{headerShown: true}}
      /> */}
      <Tab.Screen
        name="Feed"
        component={FeedNavigator}
        options={{
          headerShown: true,
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Notification"
        component={NotificationView}
        options={{
          tabBarIcon: ({color, size}) => (
            <AntDesign name="notification" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="MyProfile"
        component={ProfileNavigator}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size}) => (
            <AntDesign name="meho" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsView}
        options={{
          tabBarIcon: ({color, size}) => (
            <AntDesign name="setting" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return <MyTabs />;
}
