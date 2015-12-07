import {createStore} from 'redux'
import lightReducer from '../../reducers/light/'

export default function lightStore(initState){
  return createStore(lightReducer,initState); // 初始化创建
}