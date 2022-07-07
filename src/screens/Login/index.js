import React, {useState, useEffect,useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from 'react-native';
import Colors from '../../common/Colors';
import Common from '../../common';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CheckBox from 'react-native-check-box';
import AntDesign from 'react-native-vector-icons/AntDesign'
import PhoneInput from "react-native-phone-number-input";

import {
  validateEmail,
  validateFirstName,
  validatePassword,
  validatePhoneNo,
} from "../../utilities/validation";

import { Base64 } from 'js-base64';

import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

const Login = ({navigation}) => {
  const [show, setShow] = useState(false);
  const phoneInput = useRef();

  const [countryCode, setCountryCode] = useState('');
  const [state, setState] = useState({
    email: '',
    password: '',
    passwordError:'',
    name: '',
    cellno: '',
    cellnoError:'',
    loader:false,
    
  });

 



  const login = () => {
    let {email, cellno, password, name} = state;

    
    

   
    if (validatePhoneNo(cellno.replace(" ","")).status !== true) {
      setState({...state, cellnoError: validatePhoneNo(cellno).message})
      // setMobileNumberError(validatePhoneNo(mobileNumber).message);
    } 
    else if (validatePassword(password).status !== true) {
      setState({...state, passwordError: validatePassword(password).message})
      // setPasswordTextError(validatePassword(passwordText).message);
    }
    else {
    setState({...state, loader:true});
    let data = {
      // email: email,
      cellno: cellno,
      pwd: password,
      // fname: name,
    };
    
    
    firestore().collection("users").where("phone_no","==",cellno.replace(" ","")).get()
    .then(async(res)=>{
     console.log(res.docs)
      if(res.size>0){
        if(data.pwd == Base64.decode(res.docs[0]._data.password).toString()){
          const user = {    
            "glname":res.docs[0]._data.glname,
            "id":res.docs[0].id,
            "email":res.docs[0]._data.email,
            "phone_no":res.docs[0]._data.phone_no,
            "currency":res.docs[0]._data.currency
        }
        await AsyncStorage.setItem("user",JSON.stringify(user))
        navigation.reset({
          index: 0,
          routes:[{ name: 'Home'}],
        });
        }else{
          Alert.alert("Invalidat Email or Password")
        }
        setState({...state, loader:false});

      }else{
        Alert.alert("Invalid Email or Password")
    setState({...state, loader:false});

      }
    })
  }
  };
  return (
    <ImageBackground
      source={Common.Images.Background_Image}
      style={{flex: 1}}
      imageStyle={{height: '100%', width: '100%', resizeMode: 'stretch'}}>
      <View style={styles.container}>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText1}>Settle.ac</Text>
            <Text style={styles.headerText2}>
              Social Messanger for maintaining accounts amoung friends and
              business
            </Text>
          </View>
          <View>
            <Text style={styles.loginText}>Login</Text>
          </View>








         





          <View style={{marginVertical: 0,marginTop:20}}>
            
            
            <PhoneInput
            ref={phoneInput}
            
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
                secureTextEntry
                onChangeText={(e) => setState({...state, password: e, passwordError:''})}
                value={state.password}
              />
              {state.passwordError != '' && <Text style={{color: 'red'}}>{state.passwordError}</Text>}
            </View>
          </View>
          
          {/* <View style={{marginVertical: 20}}>
            <Text style={{color: '#ffffff'}}>Name</Text>
            <View>
              <TextInput
                style={styles.input}
                onChangeText={(e) => setState({...state, name: e})}
                value={state.name}
              />
            </View>
          </View> */}
          <View style={styles.container2}>
           
           
          </View>
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity style={styles.loginBtn} onPress={login}>
              <Text style={{color: 'white'}}>LOGIN</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={{color: Colors.White_Color}}>Create Account</Text>
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

export default Login;
