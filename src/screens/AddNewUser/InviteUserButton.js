import React from 'react'
import {View,Text,TouchableOpacity, Alert} from 'react-native'
import firestore from '@react-native-firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage'
import SendSMS from 'react-native-sms'

export default class InviteUserButton extends React.Component{
    state = {
        visible:false
    }
    check = async()=>{
        const user = await AsyncStorage.getItem("user")
        const parse = JSON.parse(user)
        console.log(this.props.user_phone_no)
        firestore().collection("invited_users").where("invited_by","==",parse.phone_no).where("invited_user","==",this.props.user_phone_no).get()
        .then(res=>{
            if(res.size>0){
                this.setState({visible:false})
            }else{
                this.setState({visible:true})

            }
        })
        .catch(err=>{
            console.log(err)
        })
    }


    sendSMS = () => {
    
        
        SendSMS.send({
            body: 'Hi, Lets Have a chat on settleit',
            recipients: [this.props.user_phone_no],
            successTypes: ['sent', 'queued'],
            allowAndroidSendWithoutReadPermission: false
        }, (completed, cancelled, error) => {
            if (completed) {
                console.log('SMS Sent Completed');
                
            } else if (cancelled) {
                console.log('SMS Sent Cancelled');
               
            } else if (error) {
                console.log("Error")
                console.log(error.message);
                Alert.alert(error.message)
            }
        });
    }


   
    componentDidMount(){
        this.check()
    }
    render(){
        if(this.state.visible){
               
              return  <View style={{justifyContent:'center', alignItems:'center'}}>
                <TouchableOpacity onPress={this.sendSMS}>
                <Text style={{fontSize:14, fontWeight:'bold', textDecorationLine:'underline', color:'blue'}}>Invite User</Text>
                </TouchableOpacity>
            </View>
           
        }else{
            return null
        }
    }
}