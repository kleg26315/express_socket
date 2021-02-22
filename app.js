const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const fs = require('fs');
const io = require('socket.io')(server);

app.use(express.static('src'));

app.get('/', function(req, res){
    fs.readFile('./src/index.html', (err, data) => {
        if(err) throw err;

        res.writeHead(200, {
            'Content-Type' : 'text/html'
        })
        .write(data)
        .end();
    });
});

// on은 수신 emit은 발신
io.sockets.on('connection', function(socket){
    socket.on('newUserConnect', function(name){
        socket.name = name;

        var message = name + '님이 접속했습니다';

        io.sockets.emit('updateMessage', {
            name : 'SERVER',
            message : message
        });

        io.sockets.emit('changeHeader', {
            name : name,
            id : socket.id
        });
    });

    socket.on('disconnect', function(){
        var message = socket.name + '님이 퇴장했습니다';
        
        // io.sockets은 나를 포함한 전체 소켓이고
        // socket.broadcast은 나를 제외한 전체 소켓을 뜻합니다.
        socket.broadcast.emit('updateMessage', {
            name : 'SERVER',
            message : message
        });
    });

    socket.on('sendMessage', function(data){
        data.name = socket.name;
        io.sockets.emit('updateMessage', data);
    });
});

server.listen(8080, function(){
     console.log('서버 실행중...');
});

// 참고 : https://okayoon.tistory.com/entry/Express-Socketio%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%98%EC%97%AC-%EC%B1%84%ED%8C%85%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0-1-%EC%82%AC%EC%A0%84%EC%9E%91%EC%97%85?category=835827




