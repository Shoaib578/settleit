import React, {useEffect, useState,lazy,Suspense} from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
  Linking,
  ActivityIndicator,
  
} from 'react-native';
import Common from '../../common';
import Modal from 'react-native-modal';
import RNPickerSelect from 'react-native-picker-select';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import firestore from '@react-native-firebase/firestore'
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage'
import Moment from 'moment';


import  Icon  from 'react-native-vector-icons/Feather';
import { GETCHATDATA, SEARCHCHATDATA,GETBALANCE } from '../../redux/actions';
const Item = React.lazy(()=>import('./item'))
type props = {
  navigation: Object,
};



type modalProps = {
  is_visible: Boolean,
  onPressClose: Object,
};

function replaceCode(number,code){
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
const timestamp = firestore.FieldValue.serverTimestamp;

const Paid = async(date,mode,amtcr,reason,navigation,fetchData)=>{
const user = await AsyncStorage.getItem("user")
const parse = JSON.parse(user)
if(Date(date)>new Date()){
  Alert.alert("You cant choose future date")
  return false
}
let user_phone_number = navigation.getState().routes[1].name =="AddNewUser"?navigation.getState().routes[2].params.user_phone_number:navigation.getState().routes[1].params.user_phone_number
console.log(amtcr)

if(amtcr <1){
  Alert.alert("The Amount Must Be Greater than 0")
  return false
}
firestore().collection("ac_vouchers").add({
  gl2:replaceCode(user_phone_number,parse.country_code),
  glcode:parse.phone_no.replace("-","").replace("-","").replace(" ","").replace(" ",""),
  vdate:date,
  glname:parse.glname,
  gl2name:navigation.getState().routes[2].params.name,
  linenum:1,
  mode:mode,
  amtcr:amtcr,
  narr:reason,
  amtdr:0,
  vseries:"P",
  currency:parse.currency,
  createdAt:timestamp()
})


.then(res=>{
  
firestore().collection("ac_vouchers").add({
  gl2:parse.phone_no.replace("-","").replace("-","").replace(" ","").replace(" ",""),
  glcode:replaceCode(user_phone_number,parse.country_code),
  vdate:date,
  linenum:2,
  glname:parse.glname,
  gl2name:navigation.getState().routes[2].params.name,
  mode:mode,
  amtcr:0,
  narr:reason,
  amtdr:amtcr,
  vseries:"P",
  currency:parse.currency,
  createdAt:timestamp()


})
  Alert.alert("Paid Successfully")
  fetchData()
})
.catch(err=>{
  Alert.alert("Something Went Wrong")
})
}


const Receive = async(date,mode,amount,reason,navigation,fetchData)=>{
  const user = await AsyncStorage.getItem("user")
  const parse = JSON.parse(user)

  if(new Date(date)>new Date()){
    Alert.alert("Future date is not acceptable")
    return false
  }

  
  let user_phone_number = navigation.getState().routes[1].name =="AddNewUser"?navigation.getState().routes[2].params.user_phone_number:navigation.getState().routes[1].params.user_phone_number
  if(amount <1){
    Alert.alert("The Amount Must Be Greater than 0")
    return false
  }
  
  firestore().collection("ac_vouchers").add({
    gl2:replaceCode(user_phone_number,parse.country_code),
    glcode:parse.phone_no.replace(" ","").replace(" ","").replace("-","").replace("-",""),
    vdate:date,
    linenum:1,
    glname:parse.glname,
  gl2name:navigation.getState().routes[2].params.name,
    mode:mode,
    amtcr:0,
    narr:reason,
    amtdr:amount,
    vseries:"R",
    currency:parse.currency,
  createdAt:timestamp()


  })
  .then(res=>{
    firestore().collection("ac_vouchers").add({
      gl2:parse.phone_no.replace(" ","").replace(" ","").replace("-","").replace("-",""),
      glcode:replaceCode(user_phone_number,parse.country_code),
      vdate:date,
      glname:parse.glname,
  gl2name:navigation.getState().routes[2].params.name,
      linenum:2,
      mode:mode,
      amtcr:amount,
      narr:reason,
      amtdr:0,
      vseries:"R",
  currency:parse.currency,
  createdAt:timestamp()


    })
    
    Alert.alert("Recived Successfully")
    fetchData()
  })
  .catch(err=>{
    Alert.alert("Something Went Wrong")
  })
  }

const PaidModal = ({is_visible, onPressClose,navigation,fetchData,dispatchBalance}: modalPropss) => {
  Moment.locale('en')
  
  const [modeData] = useState([
    {label: 'Cash', value: 'Cash'},
    {label: 'Bank (Chq/Trf)', value: 'Bank (Chq/Trf)'},
    {label: 'Credit Card', value: 'Credit Card'},
    {label: 'Digital Wallet/UPI', value: 'Digital Wallet/UPI'},
    {label: 'Sale', value: 'Sale'},
    {label: 'Purchase', value: 'Purchase'},
    {label: 'Sale Return', value: 'Sale Return'},
    {label: 'Purchase Return', value: 'Purchase Return'},
    {label: 'Adjustment', value: 'Adjustment'},
  ]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [countryCode,setCountryCode] = useState("")
  const [date,setDate] = useState(new Date())
  const [mode,setMode] = useState("Cash")
  const [reason,setReason] = useState("")
  const [amount,setAmount] = useState("")
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const getUserCountryCode = async()=>{
    const user = await AsyncStorage.getItem("user")
    const parse = JSON.parse(user)
    console.log(parse)
    setCountryCode(parse.country_code)

    
    

  }

  useEffect(()=>{
    getUserCountryCode()
  },[])
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.warn('A date has been picked: ', date);
    setDate(date)
    hideDatePicker();
  };

  return (
    <Modal
      isVisible={is_visible}
      onSwipeComplete={onPressClose}
      useNativeDriverForBackdrop
      onBackButtonPress={onPressClose}
      swipeDirection={['down']}>
      <View style={{backgroundColor: 'white'}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderBottomColor: '#e2e2e2',
            borderBottomWidth: 1,
            padding: 20,
          }}>
            <Text>{ navigation.getState().routes[1].name =="AddNewUser"?navigation.getState().routes[2].params.name:navigation.getState().routes[1].params.name}</Text>
          
            <Text>{navigation.getState().routes[1].name =="AddNewUser"?replaceCode(navigation.getState().routes[2].params.user_phone_number,countryCode):replaceCode(navigation.getState().routes[1].params.user_phone_number,countryCode)}</Text>
        </View>
        <View style={{padding: 20}}>
          <Text style={{fontWeight: 'bold', paddingBottom: 15}}>
            Payment Paid
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20,
            }}>
            <Text>Date</Text>
            <View
              style={{
                borderWidth: 1,
                width: '50%',
                borderColor: 'grey',
                borderRadius: 6,
              }}>
              <Text
                style={{paddingVertical: 8, paddingLeft: 5}}
                onPress={showDatePicker}>
                {date?Moment(date).format("LL"):'Pick up the date'}
              </Text>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 20,
            }}>
            <Text>Amount</Text>
            <View
              style={{
                borderWidth: 1,
                width: '50%',
                borderColor: 'grey',
                borderRadius: 6,
              }}>
              <TextInput
                placeholder="Amount"
                keyboardType='numeric'
                value={amount}
                onChangeText={(val)=>setAmount(val)}
                style={{paddingVertical: 8, paddingLeft: 5}}
              />
            </View>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text>Mode</Text>
            <View
              style={{
                borderWidth: 1,
                width: '50%',
                borderColor: 'grey',
                borderRadius: 6,
              }}>
              <RNPickerSelect
                onValueChange={(value) => setMode(value)}
                useNativeAndroidPickerStyle={false}
                style={pickerStyleing}
                items={modeData}
                value={mode}
                

              />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 20,
            }}>
            <Text>Reason</Text>
            <View
              style={{
                borderWidth: 1,
                width: '50%',
                borderColor: 'grey',
                borderRadius: 6,
              }}>
              <TextInput
                placeholder="Reason"
                value={reason}
                onChangeText={(val)=>setReason(val)}
                style={{paddingVertical: 8, paddingLeft: 5}}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              borderTopWidth: 1,
              borderTopColor: '#e2e2e2',
              paddingTop: 20,
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity
              onPress={()=>{
                Paid(date,mode,amount,reason,navigation,fetchData)
                .then(()=>{
                
                setReason("")
                setAmount("")
               
                dispatchBalance()
               

                })
              }}
              style={{backgroundColor: 'green', padding: 8, borderRadius: 6}}>
              <Text style={{color: 'white'}}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={()=>onPressClose()}
              style={{backgroundColor: 'red', padding: 8, borderRadius: 6}}>
              <Text style={{color: 'white'}}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};



const ReceiveModal = ({is_visible, onPressClose,navigation,fetchData,dispatchBalance}: modalProps) => {
  const [modeData] = useState([
    {label: 'Cash', value: 'Cash'},
    {label: 'Bank (Chq/Trf)', value: 'Bank (Chq/Trf)'},
    {label: 'Credit Card', value: 'Credit Card'},
    {label: 'Digital Wallet/UPI', value: 'Digital Wallet/UPI'},
    {label: 'Sale', value: 'Sale'},
    {label: 'Purchase', value: 'Purchase'},
    {label: 'Sale Return', value: 'Sale Return'},
    {label: 'Purchase Return', value: 'Purchase Return'},
    {label: 'Adjustment', value: 'Adjustment'},
  ]);

  Moment.locale('en');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [amount,setAmount] = useState('')
  const [date,setDate] = useState(new Date())
  const [mode,setMode] = useState("Cash") 
  const [reason,setReason] = useState("")
  const [countryCode,setCountryCode] = useState("")


  const getUserCountryCode = async()=>{
    const user = await AsyncStorage.getItem("user")
    const parse = JSON.parse(user)
    console.log(parse)
    setCountryCode(parse.country_code)

    
    

  }

  useEffect(()=>{
    getUserCountryCode()
  },[])
  console.log(onPressClose)
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.warn('A date has been picked: ', date);
    setDate(date)
    hideDatePicker();
  };




  return (
    <Modal
      isVisible={is_visible}
      onSwipeComplete={onPressClose}
      useNativeDriverForBackdrop
      onBackButtonPress={onPressClose}
      swipeDirection={['down']}>
      <View style={{backgroundColor: 'white'}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderBottomColor: '#e2e2e2',
            borderBottomWidth: 1,
            padding: 20,
          }}>
          
          <Text>{ navigation.getState().routes[1].name =="AddNewUser"?navigation.getState().routes[2].params.name:navigation.getState().routes[1].params.name}</Text>

          
          <Text>{navigation.getState().routes[1].name =="AddNewUser"?replaceCode(navigation.getState().routes[2].params.user_phone_number,countryCode):replaceCode(navigation.getState().routes[1].params.user_phone_number,countryCode)}</Text>
        </View>
        <View style={{padding: 20}}>
          <Text style={{fontWeight: 'bold', paddingBottom: 15}}>
            Payment Recieved
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20,
            }}>
            <Text>Date</Text>
            <View
              style={{
                borderWidth: 1,
                width: '50%',
                borderColor: 'grey',
                borderRadius: 6,
              }}>
              <Text
                style={{paddingVertical: 8, paddingLeft: 5}}
                onPress={showDatePicker}>
                {date?Moment(date).format("LL"):'Pick up the date'}

              </Text>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 20,
            }}>
            <Text>Amount</Text>
            <View
              style={{
                borderWidth: 1,
                width: '50%',
                borderColor: 'grey',
                borderRadius: 6,
                
              }}>
              <TextInput
                placeholder="Amount"
                keyboardType='numeric'
                value={amount}
                onChangeText={(val)=>setAmount(val)}
                style={{paddingVertical: 8, paddingLeft: 5}}
              />
            </View>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text>Mode</Text>
            <View
              style={{
                borderWidth: 1,
                width: '50%',
                borderColor: 'grey',
                borderRadius: 6,
              }}>
              <RNPickerSelect
                onValueChange={(value) => setMode(value)}
                useNativeAndroidPickerStyle={false}
                style={pickerStyleing}
                value={mode}
                items={modeData}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 20,
            }}>
            <Text>Reason</Text>
            <View
              style={{
                borderWidth: 1,
                width: '50%',
                borderColor: 'grey',
                borderRadius: 6,
              }}>
              <TextInput
                placeholder="Reason"
                onChangeText={(val)=>setReason(val)}
                value={reason}
                style={{paddingVertical: 8, paddingLeft: 5}}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              borderTopWidth: 1,
              borderTopColor: '#e2e2e2',
              paddingTop: 20,
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity
              onPress={()=>{
                Receive(date,mode,amount,reason,navigation,fetchData)
                .then(()=>{
                  setReason("")
                  setAmount("")
                 
                  dispatchBalance()
                })
              }
              }
              
              style={{backgroundColor: 'green', padding: 8, borderRadius: 6}}>
              <Text style={{color: 'white'}}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={()=>onPressClose()}
              style={{backgroundColor: 'red', padding: 8, borderRadius: 6}}>
              <Text style={{color: 'white'}}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};



const ChatScreen = ({navigation}: props) => {
  const [show_paid_modal, setshow_paid_modal] = React.useState(false);
  const [show_receive_modal, setshow_recieve_modal] = React.useState(false);
  const [WantToSearch,SetWantToSearch] = useState(false)
  const [countryCode,setCountryCode] = useState("")
  const [isLoading,setLoading] = useState(true)
  const dispatch = useDispatch()

  const data = useSelector(state => state.chatData.data);
  const balance = useSelector(state => state.chatData.balance);
  
  const getUserCountryCode = async()=>{
    const user = await AsyncStorage.getItem("user")
    const parse = JSON.parse(user)
    console.log(parse)
    setCountryCode(parse.country_code)

    
    

  }
const getData = () => {
  try {
    return async dispatch => {
      const user = await AsyncStorage.getItem("user");
      const parse = JSON.parse(user)
      let user_phone_number = navigation.getState().routes[1].name =="AddNewUser"?navigation.getState().routes[2].params.user_phone_number:navigation.getState().routes[1].params.user_phone_number
      console.log(user_phone_number)
      firestore().collection("ac_vouchers").orderBy('createdAt','desc').where("gl2","==", user_phone_number).where("glcode","==",parse.phone_no).get()
      .then(res=>{
        
       console.log(res.docs)

        dispatch({
          type: GETCHATDATA,
          payload:res.docs
        });
        setLoading(false)
      })
     
    };
  } catch (error) {
    // Add custom logic to handle errors
    console.log(error);
  }
};

const getBalance = ()=>{
  try {
    return async dispatch => {
  const user = await AsyncStorage.getItem("user")
  const parse = JSON.parse(user)
  let receive = 0
  let paid = 0
  let user_phone_number = navigation.getState().routes[1].name =="AddNewUser"?navigation.getState().routes[2].params.user_phone_number:navigation.getState().routes[1].params.user_phone_number
  user_phone_number = replaceCode(user_phone_number,countryCode)
  console.log(user_phone_number)
  let my_phone = replaceCode(parse.phone_no,parse.country_code)
  firestore().collection("ac_vouchers").where("gl2","==",replaceCode(user_phone_number,countryCode)).where("glcode","==",my_phone).get()
  .then(res=>{
    res.docs.forEach(data=>{
      receive = data._data.vseries == "R"?(receive+parseFloat(data._data.amtcr)+parseFloat(data._data.amtdr)):receive
      paid = data._data.vseries == "P"?(paid+parseFloat(data._data.amtcr)+parseFloat(data._data.amtdr)):paid
  
    })
    console.log(paid)
    console.log(receive)

    dispatch({
      type: GETBALANCE,
      payload: paid>receive?paid-receive:receive-paid
    });
 
  
  })
}
}catch(err){
console.log(err)
}
  
  }


  const dispatchBalance =()=> dispatch(getBalance())
const fetchData = ()=>dispatch(getData())

 

  useEffect(()=>{
    getUserCountryCode()
    dispatchBalance()

    fetchData()
   
   

    
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
              backgroundColor: '#3091F2',
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
      <Item item={item}/>
     </Suspense>
    );
  

  };

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          height: 55,
          width: '100%',
          alignItems: 'center',
          flexDirection: 'row',
          backgroundColor: '#ffffff',
          borderBottomColor: 'gray',
          borderBottomWidth: 2,
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{height: 45, width: 40}}>
          <Image
            style={{
              height: '100%',
              widht: '100%',
              resizeMode: 'contain',
              tintColor: '#111111',
            }}
            source={Common.Images.Back_Gray_Image}
          />
        </TouchableOpacity>
       
        <View style={{height: 40, flex: 1, paddingHorizontal: 10}}>
        {WantToSearch == false? 
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
        <Text
            allowFontScaling={false}
            numberOfLines={1}
            style={{fontSize: 22, fontWeight: 'bold', color: '#111111'}}>
            { navigation.getState().routes[1].name =="AddNewUser"?navigation.getState().routes[2].params.name:navigation.getState().routes[1].params.name}
            
           
            
          </Text>

          <TouchableOpacity style={{marginTop:5}} onPress={()=>{
        if(WantToSearch == false){
        SetWantToSearch(true)

          }else{
        SetWantToSearch(false)

          }
       }}>
         <Icon name = 'search' size={30} />
       </TouchableOpacity>
          </View>
          :
          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
          <TextInput onChangeText={(val)=>{
        
        let searched_data = []
        if(val.length>1){
          data.filter(i=>{
            if(i._data.mode.toLowerCase().includes(val.toLowerCase()) || i._data.narr.toLowerCase().includes(val.toLowerCase()) || i._data.amtcr == val || i._data.amtdr==val || i._data.gl2.toLowerCase().includes(val.toLowerCase())){
              searched_data.push(i)

            }
           
            dispatch({
              type: SEARCHCHATDATA,
              payload:searched_data

            });
            
          })

        }else{
         

         
          fetchData()

        }
         
         }} style={{borderColor:'white',backgroundColor:'white',width:'75%',padding:10,borderRadius:10}} placeholder="Search"/>

<TouchableOpacity style={{marginTop:5}} onPress={()=>{
        if(WantToSearch == false){
        SetWantToSearch(true)

          }else{
        SetWantToSearch(false)

          }
       }}>
         <Icon name = 'search' size={30} />
       </TouchableOpacity>


         </View>
          }
          
        </View>
        <TouchableOpacity onPress={()=>{
          navigation.navigate("Home")
        }} style={{width: 40, height: 30}}>
          <Image
            style={{
              height: '100%',
              width: '100%',
              resizeMode: 'contain',
              tintColor: '#111111',
            }}
            source={Common.Images.ThreeDot_Image}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: Common.Colors.White_Color,
          paddingHorizontal: 10,
        }}>
        <View style={{flexDirection: 'row', paddingVertical: 5}}>
          <TouchableOpacity onPress={()=>{
              let user_phone_number = navigation.getState().routes[1].name =="AddNewUser"?navigation.getState().routes[2].params.user_phone_number:navigation.getState().routes[1].params.user_phone_number
             
             let number = ""
             if (Platform.OS === 'ios') {
             number = `telprompt:${replaceCode(user_phone_number,countryCode)}`;
             }
             else {
             number = `tel:${replaceCode(user_phone_number,countryCode)}`; 
             }
             Linking.openURL(number);
          }} style={{flex: 1, alignItems: 'flex-start'}}>
            <Text
              allowFontScaling={false}
              style={{fontSize: 12, fontWeight: 'bold', color: '#7a7a7a'}}>
                {navigation.getState().routes[1].name =="AddNewUser"?replaceCode(navigation.getState().routes[2].params.user_phone_number,countryCode):replaceCode(navigation.getState().routes[1].params.user_phone_number,countryCode)}
            </Text>


           


          </TouchableOpacity>
          <Text
              allowFontScaling={false}
              style={{fontSize: 12, fontWeight: 'bold', color: '#7a7a7a'}}>
              Total Balance :  {balance}
            </Text>
        </View>
        {isLoading == false?<FlatList
          data={data}
          renderItem={showListItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />:<ActivityIndicator size="large" color="black"/>}
      </View>
      <View
        style={{
          height: 55,
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          borderTopWidth: 2,
          borderTopColor: 'gray',
        }}>
        <TouchableOpacity
          onPress={() => setshow_recieve_modal(true)}
         
          style={{
            height: 40,
            width: 150,
            borderRadius: 20,
            justifyContent: 'space-evenly',
            alignItems: 'center',
            backgroundColor: '#50AF58',
            flexDirection: 'row',
          }}>
          <View
            style={{
              height: 25,
              width: 25,
              backgroundColor: 'lightgreen',
              borderRadius: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              allowFontScaling={false}
              style={{fontSize: 20, fontWeight: 'bold', color: '#ffffff'}}>
              +
            </Text>
          </View>
          <Text style={{fontSize: 16, fontWeight: 'bold', color: '#ffffff'}}>
            Received
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setshow_paid_modal(true)}
          style={{
            height: 40,
            width: 150,
            borderRadius: 20,
            justifyContent: 'space-evenly',
            alignItems: 'center',
            backgroundColor: '#3091F2',
            flexDirection: 'row',
          }}>
          <View
            style={{
              height: 25,
              width: 25,
              backgroundColor: 'red',
              borderRadius: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              allowFontScaling={false}
              style={{fontSize: 20, fontWeight: 'bold', color: '#ffffff'}}>
              -
            </Text>
          </View>
          <Text style={{fontSize: 16, fontWeight: 'bold', color: '#ffffff'}}>
            Paid
          </Text>
        </TouchableOpacity>
      </View>
      <PaidModal
        is_visible={show_paid_modal}
        navigation={navigation}
        fetchData={()=>fetchData()}
        dispatchBalance={()=>dispatchBalance()}

        onPressClose={() => setshow_paid_modal(false)}
      />


    <ReceiveModal
        is_visible={show_receive_modal}
        navigation={navigation}
        fetchData={()=>fetchData()}
        dispatchBalance={()=>dispatchBalance()}
        onPressClose={() => setshow_recieve_modal(false)}
      />
    </View>
  );
};

export default ChatScreen;

const pickerStyleing = StyleSheet.create({
  placeholder: {
    // color: '#05564d',
    // fontSize: hp('2%'),
    paddingVertical: 8,
    paddingLeft: 8,
    paddingRight: 20,
  },
  inputIOS: {
    color: '#000',
    // fontSize: hp('2%'),
    paddingVertical: 8,
    paddingLeft: 8,
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: 6,
    paddingLeft: '5%',
    // height: 50,
  },
  inputAndroid: {
    color: '#000',
    // fontSize: hp('2%'),
    paddingVertical: hp('0.9%'),
    paddingLeft: 8,
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: 6,
    paddingLeft: '5%',
    // height: 50,
  },
});
