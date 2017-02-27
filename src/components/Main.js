require('normalize.css/normalize.css');
require('../styles/style.less')
import Earth from './earth';

import React from 'react';

// require('styles/App.css');
// let yeomanImage = require('../images/yeoman.png');

class AppComponent extends React.Component {
  render() {
    return (
      <div id="main">
        Main
        
        <div id="earth">
          < Earth  />
        </div>
        <div id="chat">

        </div>
      </div>
      
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
