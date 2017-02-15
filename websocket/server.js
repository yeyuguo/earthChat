var express  = require('express')
var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)


app.use(express.static(__dirname + '/'));
app.get('/',function(req,res){
    res.sendFile(__dirname + '/client.html');
})

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('disconnect',function(){
        console.log('user is logout');
    })

    socket.on('client send',function(msg){
        console.log('receive message is :',msg);
        socket.emit('server send',msg)
    })


    
    

});

http.listen(3001,function(){
    console.log('listening 3001 port');
})