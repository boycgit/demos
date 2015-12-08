import { createStore } from 'redux'
import counterReducer from '../../reducers/counter/'

export default function counterStore(initState){
	return createStore(counterReducer,initState);
}