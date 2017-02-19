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
var Chat = {
    onlineUser: {},
    username: null,
    userid: null,
    socket: null,
    genUid: function() {
        return new Date().getTime() + "" + Math.floor(Math.random() * 899 + 100);
    },
    scrollBottom: function(obj) {
        var obj = obj || 'chatDiv'
        var getObj = document.getElementById(obj) || document.getElementsByClassName(obj) || document.getElementsByTagName(obj)
        getObj.scrollTop = getObj.scrollHeight
    },
    // 发送消息
    submit: function() {
        var msg = $('.inputDia').val()
        if (msg == '') {
            return false;
        }
        // console.log(this.userid)
        var clientObj = {
            roomid: null,
            userid: this.userid,
            username: this.username,
            msg: msg
        }
        Chat.socket.emit('client send', clientObj)
        $('.inputDia').val('')
    },
    clientSend: function() {
        $('#inputBox form').submit(function() {
            Chat.submit();
            // 如果不加 false 页面会跳转
            return false;
        })
    },
    serverSend: function() {
        Chat.socket.on('server send', function(serverObj) {
            var chatObj = {}
            console.log('server send obj is :', serverObj)
            chatObj.msg = serverObj.msg
            chatObj.username = serverObj.username
            // TODO 不理解 为何我用 serverObj.userid  点击头像有时候会是一样的
            // chatObj.userid = serverObj.userid
            chatObj.userid = Chat.userid
            if (serverObj.userid == Chat.userid) {
                // 当前对象发送的界面
                chatObj.avatar = 'images/t1.jpg'
                chatObj.className = 'myself'
                chatObj.alt = '自己'

                // Chat.renderMsg('myself', serverObj.msg)
            } else {
                chatObj.avatar = 'images/t2.png'
                chatObj.className = 'other'
                chatObj.alt = '别人'
                    // Chat.renderMsg('other', serverObj.msg)
            }
            // console.log('chatObj:', chatObj)
            Chat.renderMsg(chatObj);
            console.log('Chat.userid:', Chat.userid)
            console.log('serverObj.userid:', serverObj.userid)
            console.log('onlineUser 是否相等:', Chat.onlineUser != serverObj.onlineUser)
            if (Chat.onlineUser != serverObj.onlineUser) {
                Chat.onlineUser = serverObj.onlineUser
            }

            // console.log('Chat obj:', Chat)

        })
    },
    renderMsg: function(chatObj) {
        // $('#chatDiv').append(`<p class=${obj}>${msg}</p>`)
        var chatObj = chatObj
            //  || {
            //     avatar: 'images/t1.jpg',
            //     className: 'myself',
            //     alt: null,
            //     msg: 'nihao',
            // }
        if (!chatObj.msg) {
            return false;
        }
        var chatDOM
        if (chatObj.className == 'myself') {
            chatDOM = `<section class='${chatObj.className}'>
                    <div class="content">
                        ${chatObj.msg}
                    </div>
                    <span>
                        <img src="${chatObj.avatar}" alt="${chatObj.alt}">
                    </span>
                </section>`
        } else {
            chatDOM = `<section class='${chatObj.className}'>
                    <span>
                        <img src="${chatObj.avatar}" alt="${chatObj.alt}">
                    </span>
                    <div class="content">
                        ${chatObj.msg}
                    </div>
                </section>`

        }
        $('#chatDiv').append(chatDOM)
            // 添加点击事件
        $('#chatDiv section > span').on('click', 'img', function() {
            // alert(1)
            var src = $(this).attr('src')
            console.log('src:', src)
            var avatarObj = {
                avatar: src,
                username: chatObj.username,
                userid: chatObj.userid,
                school: '天津',
                age: '24',
                addr: returnCitySN.cname,
            }
            EventClass.openAvator(avatarObj)
        })
        this.scrollBottom()
    },
    exitChat: function() {
        this.socket.on('disconnect', function(onlineUser) {
            this.onlineUser = onlineUser
            Chat.onlineUser = onlineUser
            console.log('现有剩下的用户：', onlineUser)
        })
    },
    init: function(username) {
        // 不在同一个域内的连接
        Chat.socket = io.connect('ws://127.0.0.1:3001');
        // 在同一个域内的连接
        // this.socket = io()
        this.userid = this.genUid()

        // Chat.username = username || 'yeyuguo'
        Chat.username = 'yeyuguo' + this.userid.substr(-4, 4)
        this.clientSend()
        this.serverSend()
        this.exitChat()

    },
    position: function(ip) {

    }
}