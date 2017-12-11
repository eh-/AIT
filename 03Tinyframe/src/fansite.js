const net = require('net'),
	fs = require('fs'),
	App = require('./miniWeb.js').App;
const HOST = '127.0.0.1';
const PORT = 8080;
const app = new App();

app.get('/', function(req, res){
	res.sendFile('/html/index.html');
});
app.get('/about', function(req, res){
	res.sendFile('/html/about.html');
});
app.get('/css/base.css', function(req, res){
	res.sendFile('/css/base.css');
});
app.get('/dks.jpeg', function(req, res){
	res.sendFile('/img/dks.jpeg');
});
app.get('/img1.jpg', function(req, res){
	res.sendFile('/img/img1.jpg');
});
app.get('/img2.png', function(req, res){
	res.sendFile('/img/img2.png');
});
app.get('/img3.gif', function(req, res){
	res.sendFile('/img/img3.gif');
});
app.get('/random', function(req, res){
	res.sendFile('/html/random.html');
});
app.get('/randimg', function(req, res){
	const m = ['/img/img1.jpg', '/img/img2.png', '/img/img3.gif'];
	const rand = Math.floor(Math.random() * 3);
	res.sendFile(m[rand]);
});
app.get('/home', function(req, res){
	res.redirect('/');
})
app.listen(PORT, HOST);


