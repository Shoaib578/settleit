import React,{useEffect,useState} from 'react';
import {View, Text, Image, TouchableOpacity, FlatList, ActivityIndicator} from 'react-native';
import Common from '../../common';
import { PermissionsAndroid } from 'react-native';
import Contacts from 'react-native-contacts';
import PersonImage from '../../assetes/images/Person_Image.png'
import InviteUserButton from './InviteUserButton';
import { GETUSERS, SEARCHUSERS } from '../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { TextInput } from 'react-native-gesture-handler';
import  Icon  from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage'
type props = {
    navigation:Object,
}



function replaceCode(number,code){
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

const AddNewUser = ({navigation}:props) => {
    
    const [isLoading,setLoading] = useState(true)
    const [countryCode,setCountryCode] = useState("")
    const [WantToSearch,setWantToSearch] = useState(false)
    const contacts=useSelector(state=>state.users.data)
    const dispatch = useDispatch()
    const getData = () => {
      try {
        return async dispatch => {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            {
            'title': 'Contacts',
            'message': 'This app would like to view your contacts',
            'buttonPositive': 'Please accept'
            }
            )
            
            Contacts.getAllWithoutPhotos()
            .then(res=>{
                
                dispatch({
                  type: GETUSERS,
                  payload: res.sort()
                });
                setLoading(false)

                
    
            })
            .catch(err=>{
                console.log(err)
               
            })
         
         
        };
      } catch (error) {
        // Add custom logic to handle errors
        console.log(error);
      }
    };
  
    const getUserCountryCode = async()=>{
      const user = await AsyncStorage.getItem("user")
      const parse = JSON.parse(user)
      console.log(parse)
      setCountryCode(parse.country_code)

      
      

    }
    
    const fetchData = ()=>dispatch(getData()) 
 
    

    useEffect(()=>{
      getUserCountryCode()
    fetchData()
        
    },[])
    const showListData = ({item,index}) => {
        return(
            <TouchableOpacity key={index} onPress={()=>navigation.navigate("ChatScreen",{user_phone_number:item.phoneNumbers.length>0?item.phoneNumbers[0].number:null,name:item.displayName})} style={{paddingVertical:10, paddingHorizontal:15, flexDirection:'row', width:'100%', borderBottomColor:'#7a7a7a', borderBottomWidth:1}}>
                <View style={{height:50, width:50, borderRadius:20}}>
                    <Image source={PersonImage} style={{height:'100%', width:'100%', resizeMode:'contain'}} />
                </View>
                <View style={{flex:1, paddingLeft:10}}>
                    <Text style={{fontSize:20, fontWeight:'bold', color:'#111111'}}>{item.givenName}</Text>
                    <Text style={{fontSize:18, fontWeight:'500', color:'#7a7a7a'}}>{item.phoneNumbers.length>0?replaceCode(item.phoneNumbers[0].number,countryCode):null}</Text>
                </View>
              <InviteUserButton user_phone_no={item.phoneNumbers.length>0?item.phoneNumbers[0].number:null}/>
            </TouchableOpacity>
        )
    }

    return(
        <View style={{flex:1, backgroundColor:Common.Colors.White_Color}}>
            <View style={{height:55, width:'100%', paddingHorizontal:5, alignItems: 'center', flexDirection:'row', backgroundColor:Common.Colors.White_Color, borderBottomWidth:2, borderBottomColor:'#7a7a7a'}}>
            <TouchableOpacity
          onPress={() => navigation.goBack(null)}
          style={{height: 45, width: 40}}>
          <Image
            style={{
              height: '100%',
              width: '100%',
              resizeMode: 'contain',
              tintColor: '#111111',
            }}
            source={Common.Images.Back_Gray_Image}
          />
        </TouchableOpacity>
        <View style={{height: 40, flex: 1,paddingTop:3, paddingHorizontal: 10,flexDirection:'row',justifyContent:"space-between"}}>
          {WantToSearch==false?<Text
            allowFontScaling={false}
            numberOfLines={1}
            style={{fontSize: 22, fontWeight: 'bold', color: '#111111'}}>
            {'Add New User'}
          </Text>:
          <TextInput placeholder='Search User ' onChangeText={(val)=>{
            let searched_data = []
            if(val.length>0){
             contacts.map(data=>{
             if(data.givenName.toLowerCase().includes(val.toLowerCase()) == true){
              searched_data.push(data)
             }
             })
               
              dispatch({
                type: SEARCHUSERS,
                payload:searched_data.sort()
  
              });
                
              
            }else{
              fetchData()
            }
          }} style={{backgroundColor:"white",padding:10,width:'80%',borderRadius:10,borderWidth:1,borderColor:"white"}}/>
          }
<TouchableOpacity style={{marginTop:5,marginRight:10}} onPress={()=>{
        if(WantToSearch == false){
        setWantToSearch(true)

          }else{
        setWantToSearch(false)

          }
       }}>
         <Icon name = 'search' size={30} />
       </TouchableOpacity>
          

        </View>
            </View>
            <View style={{flex:1, backgroundColor:Common.Colors.White_Color}}>
               {isLoading == false? <FlatList 
                data={contacts}
                renderItem={showListData}
                keyExtractor={item=>item.id}
                showsVerticalScrollIndicator={false}
                />:<ActivityIndicator size="large" color="black" />}
            </View>
        </View>
    )
}

export default AddNewUser;