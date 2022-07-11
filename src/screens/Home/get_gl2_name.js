import React from 'react'
import {View,Text,PermissionsAndroid} from 'react-native'
import  Contacts  from 'react-native-contacts'
import AsyncStorage from '@react-native-async-storage/async-storage'
import firestore from "@react-native-firebase/firestore"
export default class GetGl2Name extends React.Component{
    state = {
        name:"",
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
      if(number[0] == "0"){
      except = number.slice(1)
      new_number = (code+except).toString()
      }else{
        new_number = number.toString()
      }
      
      return new_number.replace(" ","").replace(" ","").replace("-","").replace("-","")
      }
    getName = async()=>{
      await  PermissionsAndroid.request(
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
                  
                    if(this.replaceCode(data.phoneNumbers[0].number,this.state.countryCode) == this.replaceCode(this.props.gl2,this.state.countryCode) ){
                       
                        this.setState({name:data.displayName})
                    }else if(this.state.name.length<1){
                        this.setState({name:this.props.gl2})
                    }
                    
               
               })
    
            })
            .catch(err=>{
                console.log(err)
               
                
            })
    }

    componentDidMount(){
        this.getCountryCode()
        this.getName()
    }
    render(){
        return(
            <View>
                <Text>{this.state.name}</Text>
            </View>
        )
    }
}