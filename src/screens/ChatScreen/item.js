import React from 'react'
import {View,Text,TouchableOpacity} from 'react-native'

export default class Item extends React.Component{
    render(){
    const {item} = this.props

        return  <View style={{marginTop: 15, marginBottom: 10}}>
        {item._data.amtdr >0 ? (
          <View
            style={{
              flexDirection: 'row',
              width: '80%',
              borderRadius: 10,
              padding: 10,
              backgroundColor: '#50AF58',
              alignSelf: 'flex-start',
            }}>
            <View
              >
              <Text
                allowFontScaling={false}
                style={{fontSize: 14, fontWeight: 'bold', color: '#ffffff'}}
                numberOfLines={1}>
                {new Date( item._data.vdate.seconds*1000).toLocaleDateString()}
              </Text>

              <Text
                allowFontScaling={false}
                style={{fontSize: 14, fontWeight: 'bold', color: '#ffffff'}}
                numberOfLines={1}>
                {item._data.narr}
              </Text>
            </View>

            
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center',left:'90%'}}>
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
                  style={{fontSize: 12, fontWeight: 'bold', color: '#111111'}}>
                  {item._data.amtdr} {item._data.currency}
                </Text>
              </View>

              
            </View>
        

           


          </View>
        ) : (
         
          <View
            style={{
              flexDirection: 'row',
              width: '80%',
              borderRadius: 10,
              padding: 10,
              backgroundColor: '#3091F2',
              alignSelf: 'flex-end',
              justifyContent:"space-between"
            }}>
            <View
              >
              <Text
                allowFontScaling={false}
                style={{fontSize: 14, fontWeight: 'bold', color: '#ffffff'}}
                numberOfLines={1}>
                 {new Date( item._data.vdate.seconds*1000).toLocaleDateString()}
              </Text>

              <Text
                allowFontScaling={false}
                style={{fontSize: 14, fontWeight: 'bold', color: '#ffffff'}}
                numberOfLines={1}>
                {item._data.narr}
              </Text>
            </View>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center',left:'90%'}}>
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
                  style={{fontSize: 14, fontWeight: 'bold', color: '#111111'}}
                  numberOfLines={1}>
                  {item._data.amtcr} {item._data.currency}
                </Text>
              </View>
            </View>
           
          </View>
        
        )}
      </View>
    }
}