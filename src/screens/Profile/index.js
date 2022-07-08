import React, {useState, useEffect,useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Colors from '../../common/Colors';
import Common from '../../common';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CheckBox from 'react-native-check-box';
import {useDispatch, useSelector} from 'react-redux';
import RNPickerSelect from 'react-native-picker-select';

const currencyList = [
  { label: 'EUR', value: 'EUR' },
  { label: 'INR', value: 'INR' },
  { label: 'PKR', value: 'PKR' },
  { label: 'USD', value: 'USD' },
  { label: 'AFN', value: 'AFN' },
  { label: 'AUS', value: 'AUS' },



]
import {
  currencyValidation,
  validateEmail,
  validateFirstName,
  validatePassword,
  validatePhoneNo,
} from '../../utilities/validation';
import { Base64 } from 'js-base64';
import validator from 'validator';
import firestore from '@react-native-firebase/firestore'
import  Icon  from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PhoneInput from "react-native-phone-number-input";


const Profile = ({navigation}) => {
  const phoneInput = useRef();

  const [state, setState] = useState({
    email: '',
    emailError: '',
    password: '',
    passwordError: '',
    name: '',
    nameError: '',
    cellno: '',
    cellnoError: '',
    password2: '',
    password2Error: '',
    currency:"",
    currencyError:"",
    loader: false,
  });
 
  

  
  useEffect(()=>{
    async function getUser(){
        const user = await AsyncStorage.getItem("user")
        const parse = JSON.parse(user)
        firestore().collection("users").doc(parse.id).onSnapshot(data=>{
      setState({...state, name: data._data.glname,email:data._data.email,cellno:data._data.phone_no,currency:data._data.currency});

        })
        

    }

    getUser()
  },[])
  const update = async() => {
    const user = await AsyncStorage.getItem("user")
    const parse = JSON.parse(user)
    let {
      email,
      emailError,
      cellno,
      cellnoError,
      password,
      passwordError,
      password2,
      password2Error,
      name,
      currency,
      currencyError,
      nameError,
    } = state;

    if(validator.isMobilePhone(cellno) == false){
      Alert.alert("Invalid Phone Number")
      return false
    }
    if (validateFirstName(name).status !== true) {
      setState({...state, nameError: validateFirstName(name).message});
      // setFirstNameError(validateFirstName(name).message);
    }  else if (email == '') {
      setState({...state, emailError: 'Enter Email Address'});
      // setEmailIdError("Enter Email Address");
    } else if (validateEmail(email).status !== true) {
      setState({...state, emailError: validateEmail(emailId).message});
      // setEmailIdError(validateEmail(emailId).message);
    } else if (state.password.length>0&&validatePassword(password).status !== true) {
      setState({...state, passwordError: validatePassword(password).message});
      // setPasswordTextError(validatePassword(passwordText).message);
    } else if(currencyValidation(currency).status !== true){
      setState({...state, currencyError: 'Currency Field is required'});

    }  else {
      setState({...state, loader: true});
      let data = {
        email: email,
        cellno: cellno,
        pwd: password,
        currency:currency,
        name: name,
      };
     
      
      if(state.password.length>0){
        firestore().collection("users").doc(parse.id).update({
            email:email,
            glname:name,
            phone_no:cellno.replace("-","").replace("-","").replace(" ","").replace(" ",""),
            currency:currency,
            password:Base64.encode(password)
        })
        .then(async(res)=>{
          await firestore().collection('users').doc(parse.id).onSnapshot(async(u)=>{

            const user = {    
                "glname":u._data.glname,
                "id":u.id,
                "email":u._data.email,
                "phone_no":u._data.phone_no,
                "currency":u._data.currency
            }
            await AsyncStorage.setItem("user",JSON.stringify(user))
           })
            Alert.alert("Updated Successfull")

        })
        .catch(err=>{
            console.log(err)
            Alert.alert("Something Went Wrong")

        })
      }else{
      await  firestore().collection("users").doc(parse.id).update({
            email:email,
            glname:name,
            phone_no:cellno.replace("-","").replace("-","").replace(" ","").replace(" ",""),
            currency:currency,

        })
        .then(async(res)=>{
         
            console.log("Updated")
            Alert.alert("Updated Successfull")
         await   firestore().collection('users').doc(parse.id).onSnapshot(async(u)=>{
               
                const user = {    
                    "glname":u._data.glname,
                    "id":u.id,
                    "email":u._data.email,
                    "phone_no":u._data.phone_no,
                    "currency":u._data.currency

                }
                await AsyncStorage.setItem("user",JSON.stringify(user))
               })
            
           
        })
        .catch(err=>{
            console.log(err)
            Alert.alert("Something Went Wrong")
        })
      }
     
    
    }
  };

  return (
    <ImageBackground
      source={Common.Images.Background_Image}
      style={{flex: 1}}
      imageStyle={{height: '100%', width: '100%', resizeMode: 'stretch'}}>
        <TouchableOpacity style={{marginLeft:20,top:20}} onPress={() => navigation.toggleDrawer()}>
         <Icon name = 'menu' size={30} color="white" />
       </TouchableOpacity>
      <View style={styles.container}>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.headerContainer}>
           
            
          </View>
          <View>
            <Text style={styles.loginText}>Update Profile</Text>
          </View>
          <View>
            <Text style={{color: '#ffffff'}}>Name</Text>
            <View>
              <TextInput
                style={styles.input}
                onChangeText={(e) =>
                  setState({...state, name: e, nameError: ''})
                }
                value={state.name}
              />
              {state.nameError != '' && (
                <Text style={{color: 'red'}}>{state.nameError}</Text>
              )}
            </View>
          </View>
          <View style={{marginVertical: 20}}>
            <Text style={{color: '#ffffff'}}>email</Text>
            <View>
              <TextInput
                style={styles.input}
                onChangeText={(e) =>
                  setState({...state, email: e, emailError: ''})
                }
                value={state.email}
              />
              {state.emailError != '' && (
                <Text style={{color: 'red'}}>{state.emailError}</Text>
              )}
            </View>
          </View>


          {/* <View style={{marginVertical: 20}}>
            <Text style={{color: '#ffffff'}}>Currency</Text>
            <View>
              <TextInput
                style={styles.input}
                onChangeText={(e) =>
                  setState({...state, currency: e, currencyError: ''})
                }
                value={state.currency}
              />
              {state.currencyError != '' && (
                <Text style={{color: 'red'}}>{state.currencyError}</Text>
              )}
            </View>
          </View> */}


<Text style={{color:"white",marginTop:20,}}>Select Your Currency</Text>

          <View style={{borderBottomColor:"white",borderBottomWidth:1,width:'100%',marginTop:8,backgroundColor:"white"}}>
            
          <RNPickerSelect
            onValueChange={(value) => setState({...state,currency:value})}
           
            style={{color:"white"}}
            items={currencyList}
        />
          {state.currencyError != '' && (
                <Text style={{color: 'red'}}>{state.currencyError}</Text>
              )}
          </View>

          <View style={{marginVertical: 20}}>
          <PhoneInput
            ref={phoneInput}
            defaultValue={state.cellno}
           
            defaultCode="IN"
            layout="first"
            onChangeFormattedText={(val)=>{
              setState({...state,cellno:val})


            }}
            
           containerStyle={{width:'100%',height:68,backgroundColor:"blue"}}
           
          
            withDarkTheme
            withShadow
            autoFocus
          />
              {state.cellnoError != '' && <Text style={{color: 'red'}}>{state.cellnoError}</Text>}

          </View>

          <View style={{marginVertical: 20}}>
            <Text style={{color: '#ffffff'}}>Password</Text>
            <View>
              <TextInput
                style={styles.input}
                onChangeText={(e) =>
                  setState({...state, password: e, passwordError: ''})
                }
                value={state.password}
              />
              {state.passwordError != '' && (
                <Text style={{color: 'red'}}>{state.passwordError}</Text>
              )}
            </View>
          </View>

        

          <View style={{alignItems: 'center'}}>
            <TouchableOpacity style={styles.loginBtn} onPress={update}>
              <Text style={{color: 'white'}}>Update</Text>
            </TouchableOpacity>
        
          </View>
        </KeyboardAwareScrollView>
       
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // backgroundColor:'#42206C'
  },
  headerContainer: {},
  headerText1: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerText2: {
    width: 150,
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  loginText: {
    textAlign: 'center',
    color: Colors.White_Color,
    fontSize: 25,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  input: {
    borderBottomWidth: 3,
    paddingVertical: 10,
    borderBottomColor: '#e2e2e2',
    color: 'white',
  },
  container2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loginBtn: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginVertical: 20,
  },
  forgotText: {
    color: Colors.White_Color,
  },
});

export default Profile;
