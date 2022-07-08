import React from 'react'
import {View,Text,PermissionsAndroid} from 'react-native'
import Contacts from 'react-native-contacts';


export default class GetUsetNameByPhoneNo extends React.Component{
    state = {
        name:this.props.phone_no
    }
    componentDidMount(){
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
              
                if(data.phoneNumbers[0].number.replace("-","").replace("-","").replace(" ","").replace(" ","")  === this.props.phone_no.replace("-","").replace("-","").replace(" ","").replace(" ","") ){
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