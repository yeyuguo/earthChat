import React from 'react';
import ReactDOM from 'react-dom';

const LoginWindow = React.createClass({
    getInitialState(){
        return {
                loginUserObj:this.props.loginInfo
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
        loginUserObj.userAddr = ReactDOM.findDOMNode(this.refs.userAddr).value || returnCitySN.cname
        loginUserObj.userSchool = ReactDOM.findDOMNode(this.refs.userSchool).value || '云南省昆明市'

        if (!loginUserObj.username || loginUserObj.username =='') {
            var randomNum = parseInt(Math.random() * 10000)
            loginUserObj.username = `懒鬼${randomNum}`
        }
        // console.log('loginUserObj:---',loginUserObj)
        this.setState({loginUserObj});
        /*
        千万千万千万千万千万千万千万千万 别做
        this.props.setLoginInfo(this.state.loginUserObj)
        因为 state 会在更新之后，立马又重新刷新一下该组件内容。
        就会导致出现两次登录情况；
        */
        this.props.setLoginInfo(loginUserObj)

        // 初始化 Chat.init() 函数
        console.log(loginUserObj)
        this.props.chatInit(loginUserObj)
        console.log('loginUserObj:',this.state.loginUserObj)
        $('#loginBox').hide();
        $('#loginBox input[type="text"]').val('');
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
                                <dd> </dd>
                            </li>
                            <li className='age'>
                                <dt>年龄:</dt>
                                <dd> </dd>
                            </li>
                            <li className='school'>
                                <dt>学校:</dt>
                                <dd></dd>
                            </li>
                            <li className='addr'>
                                <dt>现居地:</dt>
                                <dd> </dd>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    },
    componentDidMount(){
        // 关闭头像详细页
        $('#close').on('click', 'p.close',function() {
            var obj = $('#resizeBig')
            if (obj.css('display') != 'none') {
                obj.css('display', 'none');
            }
        });
    }
})


const ChatWindow = React.createClass({
    getInitialState(){
        return {
                chatObj:{},
            }
    },
    render(){
        return(
            <div>
                <div id="chatDiv">
                </div>
                <div id="inputBox">
                    <form>
                        <input type="text" className='inputDia'/>
                        <input type="submit" value="发送" className="sendBtn"/>
                    </form>
                </div>
            </div>
        )
    },
    componentDidMount(){
        
    }
})

const AvatorWindow = React.createClass({
    getInitialState(){
        return({
            avatorInfo:this.props.avatorInfo,
        })
    },
    render(){
        console.log('avatorInfo state:',this.state)
        return(
                <div id="resizeBig">
                    <div id="close">
                        <p className='close'> × </p>
                    </div>
                    <img className='avator' width='150px' height='150px'/>
                    <div className="desc">
                        <ul>
                            <li className='username'>
                                <dt>姓名:</dt>
                                {/* <dd> {this.state.avatorInfo.username}</dd> */}
                                <dd> {this.props.avatorInfo.username}</dd>
                            </li>
                            <li className='age'>
                                <dt>年龄:</dt>
                                <dd> {this.props.avatorInfo.userAge}</dd>
                            </li>
                            <li className='school'>
                                <dt>学校:</dt>
                                <dd> {this.props.avatorInfo.userSchool}</dd>
                            </li>
                            <li className='addr'>
                                <dt>现居地:</dt>
                                <dd> {this.props.avatorInfo.userAddr}</dd>
                            </li>
                        </ul>
                    </div>
                </div>
        )
    },
    componentDidMount(){
        
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
                "roomid":null,
                "userid":"",
                "username":"",
                "msg":"chatInfo msg",
                "onlineUser":{}
            }
        })
    },
    handleChange(event){

    },
    chatInit(obj){
        var chatInfo = this.state.chatInfo;
        var resultObj = Object.assign({chatInfo,obj})
        console.log({resultObj})
        // Chat.init(obj);
        // console.log('chatInit loginInfo:',this.state.loginInfo)
        Chat.init(obj);
        // Chat.init(this.state.loginInfo);
    },
    getLoginInfo(obj){
        this.setState({loginInfo:obj})
    },
    getChatInfo(obj){
        this.setState({chatInfo:obj});
    },
    render(){
        return(
            <div>
                <LoginWindow loginInfo={this.state.loginInfo} setLoginInfo={this.getLoginInfo} chatInit={this.chatInit}/>
                <ChatWindow chatInfo={this.state.chatInfo} setChatInfo={this.getChatInfo} />
                {/*<AvatorWindow avatorInfo={this.state.loginInfo} />*/}
            </div>
        )
    },
    componentDidMount(){
        function chatInit(obj){
            var chatInfo = this.state.chatInfo;
            var resultObj = Object.assign({chatInfo,obj})
            console.log({resultObj})
            // Chat.init(obj);
            Chat.init(this.state.loginInfo);
        }
        chatInit.bind(this);
        
        
    },
        
})





module.exports = Chats