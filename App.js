import React, {useEffect} from 'react';
import useNavigation from '@react-navigation/native'
import {View, Text, Platform, SafeAreaView, StatusBar} from 'react-native';
import 'react-native-gesture-handler';

import Route from './src/navigation';

import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import  Colors  from './src/common'
import {createStore,applyMiddleware} from 'redux'
import allReducers from './src/redux/reducers';
import thunk from 'redux-thunk';


const App = () => {
  const store = createStore(allReducers,applyMiddleware(thunk))


  return (
    <View
      style={{
        flex: 1,
      }}>
      <StatusBar backgroundColor={Colors.Theme_Color} barStyle="light-content" />
      <SafeAreaView style={{flex: 0, backgroundColor: '#5B4AD0'}} />
      <NavigationContainer>
        <Provider store={store}>
          <Route/>
        </Provider>
      </NavigationContainer>
    </View>
  );
};

export default App;
