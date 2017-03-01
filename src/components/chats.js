import React from 'react';
import ReactDOM from 'react-dom';

const LoginWindow = React.createClass({
    getInitialState(){
        return {
                loginUserObj:{},
            }
    },
    handleClick(e){
        alert(1)
    },
    handleChange(e){
        
    },
    handleSubmit(e){
        e.preventDefault();

        var loginUserObj={}
        loginUserObj.username = ReactDOM.findDOMNode(this.refs.username).value
        loginUserObj.userAge = ReactDOM.findDOMNode(this.refs.userAge).value || '20'
        loginUserObj.userAddr = ReactDOM.findDOMNode(this.refs.userAddr).value || '云南省昆明市'
        loginUserObj.userSchool = ReactDOM.findDOMNode(this.refs.userSchool).value || '云南省昆明市'

        if (!loginUserObj.username) {
            var randomNum = parseInt(Math.random() * 10000)
            loginUserObj.username = `懒鬼${randomNum}`
        }
        // console.log('loginUserObj:---',loginUserObj)
        
        this.setState({loginUserObj});
        Chat.init(loginUserObj)
        $('#loginBox').hide();
        $('#loginBox input[type="text"]').val('')
        console.log('this.state:',this.state);
        return false;
    },
    render(){
        return(
            <div>
                <div id="loginBox">
                    <div className="content">
                        <form onSubmit={this.handleSubmit}>
                            <ul>
                                <li>
                                    <span>用户名：</span>
                                    <input className='username' type="text" placeholder="请输入用户名" ref='username'/>
                                </li>
                                <li>
                                    <span>年龄：</span>
                                    <input type="text" className="userAge" placeholder="请输入年龄" ref='userAge'/>
                                </li>
                                <li>
                                    <span>地址：</span>
                                    <input type="text" className="userAddr" placeholder="请输入地址" ref='userAddr'/>
                                </li>
                                <li>
                                    <span>学校：</span>
                                    <input type="text" className="userSchool" placeholder="请输入学校" ref='userSchool'/>
                                </li>
                                <li>
                                   <input type="submit" value='提交'/>
                                </li>
                            </ul>
                        </form>
                      

                    </div>
                </div>
                <div id="resizeBig">
                    <div id="close">
                        <p className='close'> × </p>
                    </div>
                    <img className='avator' width='150px' height='150px'/>
                    <div className="desc">
                        <ul>
                            <li className='username'>
                                <dt>姓名:</dt>
                                <dd>叶玉国</dd>
                            </li>
                            <li className='age'>
                                <dt>年龄:</dt>
                                <dd>22</dd>
                            </li>
                            <li className='school'>
                                <dt>学校:</dt>
                                <dd>不告诉你</dd>
                            </li>
                            <li className='addr'>
                                <dt>现居地:</dt>
                                <dd>...</dd>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
})


const ChatWindow = React.createClass({
    render(){
        return(
            <div>
                <div id="chatDiv">
                </div>
                <div id="inputBox">
                    <form>
                        <input type="text" name="" value="" className='inputDia'/>
                        <input type="submit" value="发送" className="sendBtn"/>
                    </form>
                </div>
            </div>
        )
    }
})


const Chats = React.createClass({
    getInitialState(){
        return({
            username:null,
            loginInfo:{
                username:null,
                userAge:null,
                userAddr:null,
                userSchool:null,
            },
            chatInfo:{

            }
        })
    },
    handleChange(event){

    },
    render(){
        return(
            <div>
                <LoginWindow loginInfo={this.loginInfo}/>
                {/*<ChatWindow />*/}
            </div>
        )
    },
    componentDidMount(){
        
    }
})





module.exports = Chats