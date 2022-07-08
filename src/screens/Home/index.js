import React, {useState, useEffect, Suspense,lazy, useContext} from 'react';
import {View, Text, FlatList, Image, TouchableOpacity, Button, Alert} from 'react-native';

import  Icon  from 'react-native-vector-icons/Feather';


import firestore from '@react-native-firebase/firestore';

import {useDispatch, useSelector} from 'react-redux';
import { GETBALANCE, GETHOMEDATA, SEARCHHOMEDATA } from '../../redux/actions';



import AsyncStorage from '@react-native-async-storage/async-storage'
import { TextInput } from 'react-native-gesture-handler';
const Item = React.lazy(()=>import('./Item'))





const props = {
  navigation: Object,
};




type addButtonProps = {
  onButtonPress: Object,
};

const AddButton = ({onButtonPress}: addButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onButtonPress}
      style={{
        height: 60,
        width: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#50AF58',
        position: 'absolute',
        bottom: '5%',
        right: '5%',
      }}>
      <Text
        allowFontScaling={false}
        style={{fontSize: 38, fontWeight: 'bold', color: '#ffffff'}}>
        +
      </Text>
    </TouchableOpacity>
  );
};






const Home = ({navigation}: props) => {
  
  const [WaantToSearch,SetWantToSearch] = useState(false)
  const dispatch = useDispatch()
  const data = useSelector(state => state.homeData.data);


 
  const [state, setState] = useState({
    email: '',
    password: '',
    passwordError:'',
    name: '',
    cellno: '',
    cellnoError:'',
    loader:false
  });
    
  const getData = () => {
    try {
      return async dispatch => {
        const user = await AsyncStorage.getItem("user");
        const parse = JSON.parse(user)

        firestore().collection("ac_vouchers").where("glcode","==",parse.phone_no.replace("-","").replace("-","").replace(" ","").replace(" ",""),"or","gl2","==",parse.phone_no.replace("-","").replace("-","").replace(" ","").replace(" ","")).get()
        .then(res=>{
          dispatch({
            type: GETHOMEDATA,
            payload: res.docs
          });
        })
       
      };
    } catch (error) {
      // Add custom logic to handle errors
      console.log(error);
    }
  };

  
  const fetchData = ()=>dispatch(getData()) 
 
  useEffect(()=>{
  fetchData()
  
   navigation.addListener("focus",()=>{
    fetchData()
   

   })
    
  
  },[])
 



  
  const showListItem = ({item, index}) => {
    
    return (
      <Suspense fallback={
      <View>


      {item._data.amtcr>0?<View  style={{
        backgroundColor: '#50AF58',
        width: '80%',
        borderRadius: 10,
        alignSelf: 'flex-start',
        padding:10,
        marginTop:10
      }}>
        <View style={{borderColor:"#4ee44e",borderWidth:1,width:'95%',height:1,borderRadius:30}}>
        <Text> </Text>
        </View>

        <View style={{borderColor:"#4ee44e",borderWidth:1,width:'95%',height:1,marginTop:10,borderRadius:30}}>
        <Text> </Text>
        </View>


        <View style={{borderColor:"#4ee44e",borderWidth:1,width:'95%',height:1,marginTop:10,borderRadius:30}}>
        <Text> </Text>
        </View>
      </View>


      :
      <View style={{
              backgroundColor: 'white',
              width: '80%',
              borderRadius: 10,
              padding:10,
              alignSelf: 'flex-end',
              marginTop:10
            }}  >
        <View style={{borderColor:"#ededed",borderWidth:1,width:'95%',height:1,borderRadius:30}}>
        <Text> </Text>
        </View>

        <View style={{borderColor:"#ededed",borderWidth:1,width:'95%',height:1,marginTop:10,borderRadius:30}}>
        <Text> </Text>
        </View>


        <View style={{borderColor:"#ededed",borderWidth:1,width:'95%',height:1,marginTop:10,borderRadius:30}}>
        <Text> </Text>
        </View>
      </View>}
      
      </View>
    }>
        <Item item={item} navigation={navigation}/>
      </Suspense>
    );
  };

  return (
    <View style={{flex: 1}}>
      <View
        style={{
         flexDirection:'row',
         justifyContent:'space-between',
         paddingHorizontal:20,
         paddingVertical:10
        }}>
       <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
         <Icon name = 'menu' size={30} />
       </TouchableOpacity>
       {WaantToSearch == false?<View>
         <Image source={require('../../assetes/images/logo.png')} style={{width:40, height:40}} />
       </View>:
       <TextInput onChangeText={(val)=>{
          let searched_data = []
          if(val.length>1){
            data.filter(i=>{
              if(i._data.mode.toLowerCase().includes(val.toLowerCase()) || i._data.narr.toLowerCase().includes(val.toLowerCase()) || i._data.amtcr == val || i._data.amtdr==val || i._data.gl2.toLowerCase().includes(val.toLowerCase())){
                searched_data.push(i)

              }
              console.log("Searched Data")
              console.log(searched_data)
              dispatch({
                type: SEARCHHOMEDATA,
                payload:searched_data

              });
              
            })

          }else{
           

           
            fetchData()

          }

          
        
       
       }} style={{borderColor:'white',backgroundColor:'white',width:'75%',padding:10,borderRadius:10}} placeholder="Search"/>
       }
       <TouchableOpacity style={{marginTop:5}} onPress={()=>{
        if(WaantToSearch == false){
        SetWantToSearch(true)

          }else{
        SetWantToSearch(false)

          }
       }}>
         <Icon name = 'search' size={30} />
       </TouchableOpacity>
      </View>
      <View style={{flex: 1, paddingHorizontal: 5}}>
        <FlatList
          data={data}
          showsVerticalScrollIndicator={false}
          renderItem={showListItem}
          keyExtractor={(item) => item.id}
        />
      </View>
      <AddButton onButtonPress={() => {
       
        navigation.navigate("AddNewUser")
         
         }} />


     

    </View>
  );
};

export default Home;
