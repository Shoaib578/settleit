import React from 'react'
import {View,Text,TouchableOpacity} from 'react-native'
import GetGl2Name from './get_gl2_name'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default class Item extends React.Component{
    componentDidMount(){
      console.log(this.props.item)
    }
    render(){
        const {item} = this.props
        return <View style={{marginTop: 15, marginBottom: 10}}>
        {item._data.amtcr > 0 ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={async() =>{
              const user = await AsyncStorage.getItem("user")
              const parse = JSON.parse(user)

               this.props.navigation.navigate('ChatScreen',{user_phone_number:item._data.glcode,name:item._data.glname})
              
            } }
            style={{
              backgroundColor: '#50AF58',
              width: '80%',
              borderRadius: 10,
              alignSelf: 'flex-start',
            }}>
            <View
              style={{
                flexDirection: 'row',
                padding: 10,
                alignSelf: 'flex-start',
                borderBottomWidth: 1,
                borderBottomColor: '#e7e7e7',
              }}>
              <View style={{flex: 2}}>
                <Text
                  allowFontScaling={false}
                  style={{fontSize: 14, fontWeight: 'bold', color: '#ffffff'}}
                  numberOfLines={1}>
                  {<GetGl2Name gl2={item._data.glname}/>}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                 width:'30%'

                }}>
                <View
                  style={{
                    backgroundColor: 'white',
                    paddingVertical: 5,
                    paddingHorizontal: 15,
                    borderRadius: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 12,
                      fontWeight: 'bold',
                      color: '#111111',
                    }}>
                    {item._data.amtcr}{item._data.currency}
                  </Text>
                </View>
              </View>
              
            </View>
            <View style={{padding: 10}}>
              <Text
                allowFontScaling={false}
                style={{fontSize: 14, fontWeight: '500', color: '#ffffff'}}>
               {new Date( item._data.vdate.seconds*1000).toLocaleDateString()} : {item._data.narr}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
         
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={
              async() =>{
                const user = await AsyncStorage.getItem("user")
                const parse = JSON.parse(user)
  
               
                  this.props.navigation.navigate('ChatScreen',{user_phone_number:item._data.glcode,name:item._data.glname})
                
              } 
            }
            style={{
              backgroundColor: 'white',
              width: '80%',
              borderRadius: 10,
              alignSelf: 'flex-end',
            }}>
            <View
              style={{
                flexDirection: 'row',
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#e7e7e7',
              }}>
              <View style={{flex: 2}}>
                <Text
                  allowFontScaling={false}
                  style={{fontSize: 14, fontWeight: 'bold', color: '#111111'}}
                  numberOfLines={1}>
                    {<GetGl2Name gl2={item._data.glname}/>}

                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                 width:'30%'

                }}>
                <View
                  style={{
                    backgroundColor: '#D3D3D3',
                    paddingVertical: 5,
                    paddingHorizontal: 15,
                    borderRadius: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 12,
                      fontWeight: 'bold',
                      color: '#111111',
                    }}>
                    {item._data.amtdr}{item._data.currency}
                  </Text>
                </View>
              </View>
            
            </View>
            <View style={{padding: 10}}>
              <Text
                allowFontScaling={false}
                style={{fontSize: 14, fontWeight: '500', color: 'black'}}>
                {new Date( item._data.vdate.seconds*1000).toLocaleDateString()} : {item._data.narr}
              </Text>
            </View>
          </TouchableOpacity>
         
        )}
      </View>
    }
}