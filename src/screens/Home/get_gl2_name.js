import React from 'react'
import {View,Text,PermissionsAndroid} from 'react-native'
import  Contacts  from 'react-native-contacts'

import firestore from "@react-native-firebase/firestore"
export default class GetGl2Name extends React.Component{
    state = {
        name:""
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
                  
                    if(data.phoneNumbers[0].number.replace("-","").replace("-","").replace(" ","").replace(" ","") == this.props.gl2.replace("-","").replace("-","").replace(" ","").replace(" ","") ){
                       
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