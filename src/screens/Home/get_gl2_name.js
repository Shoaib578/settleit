import React from 'react'
import {View,Text,PermissionsAndroid} from 'react-native'
import  Contacts  from 'react-native-contacts'
import AsyncStorage from '@react-native-async-storage/async-storage'
import firestore from "@react-native-firebase/firestore"
export default class GetGl2Name extends React.Component{
    state = {
        name:this.props.gl2,
        
    }
   componentDidMount(){
    console.log(this.props)
   }

   
    render(){
        return(
            <View>
                <Text>{this.state.name}</Text>
            </View>
        )
    }
}