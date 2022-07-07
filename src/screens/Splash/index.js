import React from 'react'
import {View,Text,Image,StyleSheet} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default class Splash extends React.Component{
    state ={
        logged_in:false
    }
    isLoggedIn = async()=>{
        const user = await AsyncStorage.getItem("user")
        const parse = JSON.parse(user)

        if(parse != null){
            this.setState({logged_in:true})
        }else{
            this.setState({logged_in:false})
            
        }

        if(this.state.logged_in){
            this.props.navigation.reset({
                index: 0,
                routes:[{ name: 'Home'}],
            });
        }else{
            this.props.navigation.reset({
                index: 0,
                routes:[{ name: 'Login'}],
            });
        }
    }


    componentDidMount(){
        setTimeout(()=>{
            this.isLoggedIn()

        },500)
    }
    render(){
        return(
            <View style={styles.container}>
                <Image source={require('../../assetes/images/logo.png')}/>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'white'
    },
    image:{
        width:100,
        height:100
    }
})
