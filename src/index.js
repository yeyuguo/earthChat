import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';

require('antd-mobile/dist/antd-mobile.min.css')
    // Render the main component into the dom

import App from './components/Main';
ReactDOM.render( < App / > , document.getElementById('app'));


{
    /*import ButtonExample from './components/antTest/Btns'
    ReactDOM.render( < ButtonExample / > , document.getElementById('app'));*/
}