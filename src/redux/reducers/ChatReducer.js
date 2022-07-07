import { GETCHATDATA, SEARCHCHATDATA,GETBALANCE } from "../actions";


const initialState = {
    data: [],
    balance:0
    
   
  };
const ChatReducer =(state=initialState,action)=>{
    switch(action.type){
        
        case GETCHATDATA:
           return {...state,data:action.payload}
        case SEARCHCHATDATA:
            return {...state,data:action.payload} 
        case GETBALANCE:
            console.log(action.payload)
            return {...state,balance:action.payload} 

        default:
            return state
    }
}
export default ChatReducer