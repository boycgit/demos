import React, {Component, PropTypes} from 'react'
import {render} from 'react-dom'
import Counter from './index'


render(
	<div id="counter">
		<Counter num={5}/>
	</div>,
	document.getElementById('demo')
)

