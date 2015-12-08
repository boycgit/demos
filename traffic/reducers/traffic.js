import { combineReducers } from 'redux'
import light from './light/'
import count from './counter/'

const rootReducer = combineReducers({
    light,
    count
});

export default rootReducer