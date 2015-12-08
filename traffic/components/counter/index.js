import React, { PropTypes, Component } from 'react'
import { render } from 'react-dom'
import './index.less'

class Counter extends Component{

	render(){
		return (
			<div className="counter-wrap">
				<p className="count">{this.props.num}</p>
			</div>
		)
	}
}

Counter.propTypes = {
	num:PropTypes.number.isRequired
}

Counter.defaultProps = {
	num : 4
}

export default Counter