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
  FlatList,
} from 'react-native';
import Colors from '../../common/Colors';
import Common from '../../common';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CheckBox from 'react-native-check-box';
import {useDispatch, useSelector} from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign'
import PhoneInput from "react-native-phone-number-input";
import RNPickerSelect from 'react-native-picker-select';
import validator from 'validator';
import {
  currencyValidation,
  passwordValidation,
  validateEmail,
  validateFirstName,
  validatePassword,
  validatePhoneNo,
} from '../../utilities/validation';
import { Base64 } from 'js-base64';

import firestore from '@react-native-firebase/firestore'
import { SafeAreaView } from 'react-native-safe-area-context';

const currencyList = [
  { label: 'EUR', value: 'EUR' },
  { label: 'INR', value: 'INR' },
  { label: 'PKR', value: 'PKR' },
  { label: 'USD', value: 'USD' },
  { label: 'AFN', value: 'AFN' },
  { label: 'AUS', value: 'AUS' },



]
const selectedItem = {
  title: 'Selected item title',
  description: 'Secondary long descriptive text ...',
};

const Signup = ({navigation}) => {
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
    currencyError:"",
    currency:"",
    loader: false,
  });

  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState('');
  
  const phoneInput = useRef();

  const signup = () => {
   


    let {
      email,
      emailError,
      cellno,
      cellnoError,
      password,
      passwordError,
      password2,
      password2Error,
      currencyError,
      name,
      currency,
      
      nameError,
    } = state;
    
    if(validator.isMobilePhone(cellno) == false){
      Alert.alert("Invalid Phone Number")
      return false
    }

    
    if (validateFirstName(name).status == false) {
      setState({...state, nameError: validateFirstName(name).message});
      // setFirstNameError(validateFirstName(name).message);
    } else if (email == '') {
      setState({...state, emailError: 'Enter Email Address'});
      // setEmailIdError("Enter Email Address");
    } else if (validateEmail(email).status == false) {
      setState({...state, emailError: validateEmail(email).message});
      // setEmailIdError(validateEmail(emailId).message);
    } else if (passwordValidation(password).status == false) {
      setState({...state, passwordError: passwordValidation(password).message});
      // setPasswordTextError(validatePassword(passwordText).message);
    } else if (password2 !== password) {
      setState({...state, password2Error: 'Please enter same password'});
      // setPasswordTextError(validatePassword(passwordText).message);
    }else if(currencyValidation(currency).status == false){
      setState({...state, currencyError: 'Currency Field is required'});

    } else {
      setState({...state, loader: true});
      let data = {
        email: email,
        cellno: cellno,
        pwd: password,
        pwd2: password2,
        name: name,
        currency:currency
      };
     firestore().collection("users").where("phone_no","==",data.cellno.replace("-","").replace("-","").replace(" ","").replace(" ","")).get()
     .then(res=>{
      if(res.size>0){
      setState({...state, loader: false});
        
        Alert.alert("Phone Number Already Exists.Please Try Another One")
      }else{
        firestore().collection("users").add({
          glname:data.name,
          phone_no:cellno.replace("-","").replace("-","").replace(" ","").replace(" ",""),
          password:Base64.encode(data.pwd),
          currency:data.currency,
          email:data.email
         })
         .then(()=>{
          setState({...state, loader: false});

          Alert.alert("You are Registered Successfully")
         })
         .catch(err=>{
          setState({...state, loader: false});

    
          Alert.alert("Something Went Wrong")
         })
      }
     })
     .catch(err=>{
      Alert.alert("Something Went Wrong")
      setState({...state, loader: false});

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
            <Text style={styles.loginText}>Signup</Text>
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

        
        
              {state.cellnoError != '' && (
                <Text style={{color: 'red'}}>{state.cellnoError}</Text>
              )}


         
        <Text style={{color:"white",marginTop:20,}}>Select Your Currency</Text>

          <View style={{borderBottomColor:"white",borderBottomWidth:1,width:'100%',marginTop:8,backgroundColor:"white"}}>
            
          <RNPickerSelect
            onValueChange={(value) => setState({...state,currency:value})}
          
           
            items={currencyList}
        />
       
       
          {state.currencyError != '' && (
                <Text style={{color: 'red'}}>{state.currencyError}</Text>
              )}
          </View>
       


          <View style={{marginVertical: 20}}>
            <Text style={{color: '#ffffff'}}>Password</Text>
            <View>
              <TextInput
                style={styles.input}
                secureTextEntry
                keyboardType='numeric'

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

          <View style={{marginVertical: 20}}>
            <Text style={{color: '#ffffff'}}>Confirm Password</Text>
            <View>
              <TextInput
                style={styles.input}
                secureTextEntry
                keyboardType='numeric'
                onChangeText={(e) =>
                  setState({...state, password2: e, password2Error: ''})
                }
                value={state.password2}
              />
              {state.password2Error != '' && (
                <Text style={{color: 'red'}}>{state.password2Error}</Text>
              )}
            </View>
          </View>

          <View style={{alignItems: 'center'}}>
            <TouchableOpacity style={styles.loginBtn} onPress={signup}>
              {state.loader?<ActivityIndicator size="small" color="white"/>:null}
              <Text style={{color: 'white'}}>Signup</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={{color: Colors.White_Color}}>
                Already had Account ? click here to login
              </Text>
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
  countryCodePicker: {
    alignSelf: 'center'
  },
  togglerContainerStyle: {
    backgroundColor: '#BAFFC0',
    borderRadius: 10,
    padding: 5
  },
  togglerLabelStyle: {
    fontSize: 20
  },
  searchInputStyle: {
    borderColor: '#888888',
    borderWidth: 1,
    height: 36,
    borderRadius: 10,
    paddingHorizontal: 10
  },
  pickerItemLabelStyle: {
    marginLeft: 10,
    marginVertical: 10,
    alignSelf: 'center'
  },
  pickerItemContainerStyle: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignSelf: 'center'
  }
});

export default Signup;
