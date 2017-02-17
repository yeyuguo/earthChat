var express = require('express')
var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)


app.use(express.static(__dirname + '/'));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client.html');
})


app.get('/position', function(req, res) {
    var httpR = require('./httpRequest')
    httpReq = httpR.httpRequest()
    var httpOption = {
        host: 'http://int.dpool.sina.com.cn',
        port: '80',
        path: '/iplookup/iplookup.php?format=js',
        method: 'GET'
    }
    httpReq.get(req, res)
})

var onlineUser = {}
io.on('connection', function(socket) {
    // socket.name = null;
    console.log('a user connected');
    // console.log('socket name :',socket.name)
    socket.on('disconnect', function() {
        if (onlineUser.hasOwnProperty(socket.name)) {
            delete onlineUser[socket.name]
        }
        // console.log('user is logout');
        console.log('disconnected obj:', socket.name)
        io.emit('disconnect', onlineUser)
    })

    socket.on('client send', function(clientObj) {

        // console.log('receive message is :', clientObj);
        if (!clientObj.userid) {
            return false
        }
        // console.log('socket name :',socket.name)
        // 首次进入 记录唯一 ID,便于 onlineUser的变化
        if (!socket.name) {
            socket.name = clientObj.userid;
        }
        // 设置 onlineUser
        var userid = clientObj.userid
        if (!onlineUser.hasOwnProperty(userid)) {
            onlineUser[userid] = clientObj.username
        }
        // 判断 onlineUser 是否有变化
        if (clientObj.onlineUser != onlineUser) {
            clientObj.onlineUser = onlineUser
        }
        // 此处不能用 socket.emit 来返回，否则的话就被锁定在一个socket里
        io.emit('server send', clientObj)
    })
});

http.listen(3001, function() {
    console.log('listening 3001 port');
})