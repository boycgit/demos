import {CHANGE_GREEN, CHANGE_YELLOW, CHANGE_RED} from '../../constants/TrafficLight'

// 定义初始化状态，初始化状态是常量
// 初始状态是红灯
const initState = {
  color:'red',
  time:'7' // 持续时间20ms
}


// 定义灯转换的reducer函数
export default function light(state=initState,action){
  switch(action.type){
    case CHANGE_GREEN:
      return {
        color:'green',
        time:'5'
      }
    
    case CHANGE_YELLOW:
      return {
        color:'yellow',
        time:'3'
      }
    
    case CHANGE_RED:
      return Object.assign({},initState);
    
    default:
      return state
  }
}