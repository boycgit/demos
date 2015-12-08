import counterStore from '../../stores/counter/'
import * as CounterActions from '../../actions/counter/'

import React, { Component, PropTypes } from 'react'
import {render} from 'react-dom'
import { Provider, connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Counter from './index'


let store = counterStore({num:10});

class App extends Component{
	_bind(...methods){
		methods.forEach((method)=>this[method] = this[method].bind(this));
	}
	constructor(){
		super();
		this._bind('autoChange','handleClick');
		this.state = {
			timeId:null
		}
	}
	autoChange(){ // 自动更改红绿灯
		const { count, actions } = this.props;
		let _self = this;

		actions.countDown();
		
		if(this.state.timeId && count.num <= 1){
			clearTimeout(this.state.timeId);
			return;
		}

		// 自动更改
		this.state.timeId = setTimeout(function(){
			_self.autoChange();
		},1000);

	}
	handleClick(){
		if(this.state.timeId){
			clearTimeout(this.state.timeId);
		} else {
			this.autoChange();
		}		
	}
	render(){
		const { count,actions} = this.props;
		return(
			<div id="counter" onClick={this.handleClick}>
				<Counter num={count.num}/>
			</div>
		)
	}	
}


// 声明 connect 连接
// 将 redux 中的 state传给 App
function mapStateToProps(state){
	return {
		count : state
	}
}

function mapDispatchToProps(dispatch){
	return {
		actions : bindActionCreators(CounterActions,dispatch)
	}
}

App = connect(mapStateToProps,mapDispatchToProps)(App);



// let unsubscribe = store.subscribe(() =>
//   console.log(store.getState())
// );

// store.dispatch(CounterActions.countDown());
// store.dispatch(CounterActions.countDown());
// store.dispatch(CounterActions.countDown());
// store.dispatch(CounterActions.countDown());

render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('demo')
)