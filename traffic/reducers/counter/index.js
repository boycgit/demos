import { COUNT_DOWN, COUNT_UP, COUNT_INIT} from '../../constants/Counter'

// 初始化状态
const initState = {
	num : 0
}

// 定义计数器转换函数
export default function count(state = initState,action){

	switch(action.type){
		case COUNT_DOWN :
			return {num : state.num - action.step};
			break;
		case COUNT_UP :
			return {num : state.num + action.step};
			break;
		case COUNT_INIT : 
			return {num : action.num };
			break
		default:
			return state;
	}

}