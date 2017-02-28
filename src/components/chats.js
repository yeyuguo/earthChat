import React from 'react';

const LoginWindow = React.createClass({
    render(){
        return(
            <div>
                <div id="loginBox">
                    <div className="content">
                        <form>
                            <ul>
                                <li>
                                    <span>用户名：</span>
                                    <input className='username' type="text" placeholder="请输入用户名"/>
                                </li>
                                <li>
                                    <span>年龄：</span>
                                    <input type="text" className="userAge" placeholder="请输入年龄"/>
                                </li>
                                <li>
                                    <span>地址：</span>
                                    <input type="text" className="userAddr" placeholder="请输入地址"/>
                                </li>
                                <li>
                                    <span>学校：</span>
                                    <input type="text" className="userSchool" placeholder="请输入学校"/>
                                </li>
                                <li>
                                    <input type="submit" value='登录'/>
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
                        <input type="text" name="" value="" class='inputDia'/>
                        <input type="submit" value="发送" class="sendBtn"/>
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
                <LoginWindow />
                <ChatWindow />
            </div>
        )
    },
    componentDidMount(){
        
    }
})





module.exports = Chats