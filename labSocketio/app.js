var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.use(express.static('public'));

app.get('/', function(req, res){
	res.render('index');
});

io.on('connection', function(socket){
	socket.broadcast.emit('newcon', socket.id);
	console.log(socket.id, ' connected');
	socket.on('disconnect', function(){
		console.log(socket.id, ' disconnected');
	});
	
	socket.on('clicked', function(btn){
		console.log('clicked: ', btn);
		io.sockets.emit('clicked', btn);
	});
	
	socket.on('coords', function(coords){
		io.sockets.emit('coords', coords);
	});
});

server.listen(3000);