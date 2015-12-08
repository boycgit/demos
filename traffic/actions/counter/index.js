import { COUNT_DOWN, COUNT_UP, COUNT_INIT} from '../../constants/Counter'

// 向下计数
export function countDown(step = 1){
	return {
		type : COUNT_DOWN,
		step : step
	}
}

// 向上计数
export function countUp(step = 1){
	return {
		type : COUNT_UP,
		step : step
	}
}

export function countInit(num){
	return {
		type : COUNT_INIT,
		num : num
	}
}