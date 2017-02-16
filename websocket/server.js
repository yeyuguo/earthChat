var express = require('express')
var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)


app.use(express.static(__dirname + '/'));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client.html');
})

io.on('connection', function(socket) {
    var onlineUser = {}
    console.log('a user connected');

    socket.on('disconnect', function() {
        console.log('user is logout');
    })

    socket.on('client send', function(clientObj) {
        console.log('receive message is :', clientObj);
        if (!clientObj.userid) {
            return false
        }
        var userid = clientObj.userid
        if (!onlineUser.hasOwnProperty(userid)) {
            onlineUser[userid] = clientObj.username
        }
        clientObj.onlineUser = onlineUser
        socket.emit('server send', clientObj)
    })
});

http.listen(3001, function() {
    console.log('listening 3001 port');
})