/** 
 * 
 *----------Dragon be here!----------/ 
 * 　　　┏┓　　　┏┓ 
 * 　　┏┛┻━━━┛┻┓ 
 * 　　┃　　　　　　　┃ 
 * 　　┃　　　━　　　┃ 
 * 　　┃　┳┛　┗┳　┃ 
 * 　　┃　　　　　　　┃ 
 * 　　┃　　　┻　　　┃ 
 * 　　┃　　　　　　　┃ 
 * 　　┗━┓　　　┏━┛ 
 * 　　　　┃　　　┃神兽保佑 
 * 　　　　┃　　　┃代码无BUG！ 
 * 　　　　┃　　　┗━━━┓ 
 * 　　　　┃　　　　　　　┣┓ 
 * 　　　　┃　　　　　　　┏┛ 
 * 　　　　┗┓┓┏━┳┓┏┛ 
 * 　　　　　┃┫┫　┃┫┫ 
 * 　　　　　┗┻┛　┗┻┛ 
 * ━━━━━━神兽出没━━━━━━
 */
require('normalize.css/normalize.css');
require('../styles/style.less')
import Earths from './earths';
import Chats from './chats';

import React from 'react';


// require('styles/App.css');
// let yeomanImage = require('../images/yeoman.png');

class AppComponent extends React.Component {
  render() {
    return (
      <div id="main">
        Main
        <div id="earth">
          < Earths  />
        </div>
        <div id="chat">
          < Chats />
        </div>
      </div>
      
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
