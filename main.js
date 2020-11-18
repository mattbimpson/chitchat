var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

const port = 80;
var clients = [];

app.use(express.static('public'));

function errorHandler (err, _req, res, _next) {
  res.status(500);
  res.render('error', { error: err });
}

app.use(errorHandler);

app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io/client-dist/'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

io.on('connection', function(socket) {
    clients.push(socket.id);

    socket.on('chat message', function(msg){
        if (msg === '') {
          return
        };
        var name = socket.nickname || 'unknown';
        io.emit('chat message', `${name}: ${msg}`);
        LogMessage(name, msg);
    })

    socket.on('send-nickname', function(nickname) {
        if (nickname === '') {
          return
        };
        socket.nickname = nickname;
        clients.push({nickname: socket.nickname, id: socket.id});
        UpdateClientNickname(socket.id, socket.nickname);

        var msg = `User  ${socket.nickname} is in the house...`;
        io.emit('notification', msg);
    })
});

http.listen(port, function() {
    console.log(`listenening on port ${port}`);
});

function UpdateClientNickname(id, name) {
    clients.forEach(function(c) {
        if (c.id === id) {
            c.nickname = name;
        }
    });
}

function LogMessage(nickname, message) {
    fs.appendFile('chat.txt', `${GetDateTime()},${nickname},${message}\r\n`, function(_err) {});
}

function GetDateTimeShort(datetime) {
  var dateStr =  `${datetime.getFullYear()}-${parseInt(datetime.getMonth() + 1)}-${datetime.getDate()}`;
  var timeStr = `${datetime.getHours()}:${datetime.getMinutes()}:${datetime.getSeconds()}`;
  return `${dateStr} ${timeStr}`;
}

function GetDateTime() {
  var now = new Date();
  return GetDateTimeShort(now);
}
