import React from 'react'
import {View,Text,Image} from 'react-native'
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
        return <View style={{justifyContent:"center",alignItems:'center',flex:1,backgroundColor:"white"}}>
                     <Image source={require('../../assetes/images/logo.png')} style={{width:100,height:100}}/>

        </View>
    }
}