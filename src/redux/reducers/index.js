import {combineReducers} from 'redux'
import AddNewUserReducer from './AddNewUser'
import ChatReducer from './ChatReducer'
import HomeReducer from './HomeReducer'

const allReducers =combineReducers({
    homeData:HomeReducer,
    chatData:ChatReducer,
    users:AddNewUserReducer
})

export default allReducers