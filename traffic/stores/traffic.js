import { createStore } from 'redux'
import rootReducer from '../reducers/traffic'

export default function trafficStore(initState){
    return createStore(rootReducer,initState);
}