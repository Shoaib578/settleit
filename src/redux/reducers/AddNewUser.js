import { GETCHATDATA, SEARCHCHATDATA,GETBALANCE, SEARCHUSERS, GETUSERS } from "../actions";


const initialState = {
    data: [],
   
    
   
  };
const AddNewUserReducer =(state=initialState,action)=>{
    
   

    switch(action.type){
        
        case GETUSERS:
           return {...state,data:action.payload}
        case SEARCHUSERS:
            return {...state,data:action.payload} 
        

        default:
            return state
    }
}
export default AddNewUserReducer