import React from 'react'
import {View,Text} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default class Logout extends React.Component{
    logout  = async()=>{
        await AsyncStorage.removeItem("user")
        this.props.navigation.reset({
            index: 0,
            routes:[{ name: 'Login'}],
        });
    }

    componentDidMount(){
        this.logout()
    }
    render(){
        return <View style={{justifyContent:"center",alignItems:'center',flex:1}}>
                <Text style={{fontSize:15}}>Logging out...</Text>
        </View>
    }
}