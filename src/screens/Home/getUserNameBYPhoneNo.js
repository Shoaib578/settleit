import React from 'react'
import {View,Text,PermissionsAndroid} from 'react-native'
import Contacts from 'react-native-contacts';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class GetUsetNameByPhoneNo extends React.Component{
    state = {
        name:this.props.phone_no,
        countryCode:""
    }

    getCountryCode = async()=>{
        const user = await AsyncStorage.getItem("user")
        const parse = JSON.parse(user)
        this.setState({countryCode:parse.country_code})
    }
    replaceCode = (number,code)=>{
        let new_number = ''
        let except = ''
      if(number[0] === "0"){
      except = number.slice(1)
      new_number = (code+except).toString()
      }else{
        new_number = number.toString()
      }
      
      return new_number.replace(" ","").replace(" ","").replace("-","").replace("-","")
      }
    componentDidMount(){
        this.getCountryCode()
        PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            {
            'title': 'Contacts',
            'message': 'This app would like to view your contacts',
            'buttonPositive': 'Please accept'
            }
            )
            
            Contacts.getAllWithoutPhotos()
            .then(res=>{
                
               res.forEach(data=>{
                if(this.replaceCode(data.phoneNumbers[0].number,this.state.countryCode) == this.replaceCode(this.props.phone_no,this.state.countryCode) ){
              
                    console.log(data.givenName)
                    this.setState({name:data.givenName})
                }else if(this.state.name.length<1){
                    this.setState({name:this.props.phone_no})

                }
               })
    
            })
            .catch(err=>{
                console.log(err)
               
                
            })
    }
    render(){
            return <Text>{this.state.name}</Text>
    }
}