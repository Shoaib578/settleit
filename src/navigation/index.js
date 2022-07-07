import React, {useEffect, useState} from 'react';
import {createStackNavigator,CardStyleInterpolators  } from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native'
import {createDrawerNavigator} from '@react-navigation/drawer';
import {useDispatch, useSelector} from 'react-redux';
import {View, Image, StyleSheet} from 'react-native';
import {Home, ChatScreen, AddNewUser, Login, Signup} from '../screens';
import Splash from '../screens/Splash';
import Profile from '../screens/Profile';
import Logout from '../screens/Logout';
import { TextInput } from 'react-native-gesture-handler';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const Route = (props) => {

  function DrawerNav() {
    return (
      <Drawer.Navigator>
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="Profile" component={Profile} />
        <Drawer.Screen name="Logout" component={Logout} />

      </Drawer.Navigator>
    );
  }

  return (
    <Stack.Navigator headerMode="none" initialRouteName='Splash' screenOptions={{gestureEnabled:true,gestureDirection:'horizontal', cardStyleInterpolator:CardStyleInterpolators.forHorizontalIOS,}}>
      <Stack.Screen name="Splash" component={Splash} options={{headerShown:false}}/>

      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Home" component={DrawerNav} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} options={{headerTitle:'Loading'}}/>
      <Stack.Screen name="AddNewUser" component={AddNewUser} />
    </Stack.Navigator>
  );
};

export default Route;
