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
    loginUserObj: null,
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
            avatarInfo:Chat.loginUserObj,
            msg: msg
        }
        console.log({clientObj})
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
            chatObj.avatarInfo = serverObj.avatarInfo
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

                /*
                地球仪上 显示对话内容
                地球仪上只显示 other 其他人发送过来的小时
                */
                var serverSendObj = {}
                serverSendObj.msg = chatObj.msg
                Earth.markMsg(serverSendObj)
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
        // 对话框内 显示对话内容
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
                school: chatObj.avatarInfo.userSchool,
                age: chatObj.avatarInfo.userAge,
                addr: chatObj.avatarInfo.userAddr,
                // addr: returnCitySN.cname,
            }
            Chat.EventHandle.openAvator(avatarObj)
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
    init: function(loginUserObj) {
        // 不在同一个域内的连接
        Chat.socket = io.connect('ws://127.0.0.1:3001');
        // Chat.socket = io.connect('ws://10.9.32.16:3001');
        // 在本地连接里才能使用
        // this.socket = io()
        this.userid = this.genUid()

        Chat.username = loginUserObj.username
        Chat.loginUserObj = loginUserObj
        console.log('Chat.loginUserObj:',Chat.loginUserObj)
            // Chat.username = username || 'yeyuguo'
            // Chat.username = 'yeyuguo' + this.userid.substr(-4, 4)
        this.clientSend()
        this.serverSend()
        this.exitChat()

    },
    position: function(ip) {

    },

    EventHandle: function() {
        // 关闭头像详细页
        function closeAvator(obj) {
            var obj = obj || $('#resizeBig')
            if (obj.css('display') != 'none') {
                obj.css('display', 'none');
            }
        }
        // 打开头像详情页
        function openAvator(avatarObj) {
            if ($('#resizeBig').css('display') == 'none') {
                $('#resizeBig').css('display', 'block');

                console.log('avatarObj:', avatarObj)
                var now_username = $('#resizeBig').find('.username dd').text()
                if (avatarObj && avatarObj.username != now_username) {
                    console.log('点击的头像与上一次不同，替换内容')
                    renderAvatar(avatarObj)
                }
            }
        }
        // 处理 头像-详情页 的信息
        function renderAvatar(avatarObj) {
            console.log('renderAvatar obj:', avatarObj)
            var avatarObj = avatarObj || {
                avatar: '../images/t2.png',
                username: '小白',
                userid: '123213213',
                school: '天津',
                age: '24',
                addr: '昆明',
            }
            var paraentObj = $('#resizeBig')
            paraentObj.find('img').attr('src', avatarObj.avatar)

            paraentObj.find('.username dd').text(avatarObj.username)
            paraentObj.find('.age dd').text(avatarObj.age)
            paraentObj.find('.school dd').text(avatarObj.school)
            paraentObj.find('.addr dd').text(avatarObj.addr)
        }
        return {
            onceHandle: function() {
                
            }(),
            closeAvator: closeAvator,
            openAvator: openAvator,
            renderAvatar: renderAvatar,
        }

    }(),

}