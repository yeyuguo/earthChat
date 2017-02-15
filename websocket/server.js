var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)


app.get('/',function(req,res){
    res.sendFile(__dirname + '/client.html');
})

io.on('connection',function(){
    console.log('new user connected');
})

http.listen(3001,function(){
    console.log('listening 3001 port');
})