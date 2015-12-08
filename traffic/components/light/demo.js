import React, {Component, PropTypes} from 'react'
import {render} from 'react-dom'
import Light from './index'

var color = 'red';

render(
    <div id="traffic">
        <Light color={color}/>
    </div>,
    document.getElementById('demo')
)