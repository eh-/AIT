const net = require('net'),
	fs = require('fs');
const HOST = '127.0.0.1';
const PORT = 8080;

function Request(newRequest){
	const splits = newRequest.split('\r\n');
	const requestLine = splits[0].split(' ');
	this['method'] = requestLine[0];
	this['path'] = requestLine[1];
	this['body'] = splits[splits.length - 1];
	let headers = {};
	for(let i = 1; i < splits.length - 2; i++){
		let header = splits[i].split(': ');
		headers[header[0]] = header[1];
	}
	this['headers'] = headers;
}
Request.prototype.toString = function(){
	let headObj = this.headers;
	let headerVars = Object.keys(this.headers);
	let fullreq = this.method + ' ' + this.path + ' HTTP/1.1\r\n';
	for(let i = 0; i < headerVars.length; i++){
		fullreq += headerVars[i] + ': ' + headObj[headerVars[i]] + '\r\n';
	}
	fullreq += '\r\n' + this.body;
	return fullreq;
};

const statusCodes = {
	'200': 'OK',
	'404': 'Not Found',
	'500': 'Internal Server Error',
	'400': 'Bad Request',
	'301': 'Moved Permanently',
	'302': 'Found',
	'303': 'See Other',
};
const fileExts = {
	'jpeg': 'image/jpeg',
	'jpg': 'image/jpeg',
	'png': 'image/png',
	'gif': 'image/gif',
	'html': 'text/html',
	'css': 'text/css',
	'txt': 'text/plain',
};

function Response(socket){
	this['socket'] = socket;
	this['headers'] = {};
	this['body'] = '';
	this['statusCode'] = '';
}
Response.prototype.setHeader = function(header, value){
	this['headers'][header] = value;
};
Response.prototype.write = function(data){
	this.socket.write(data);
};
Response.prototype.end = function(data){
	this.socket.end(data);
};
Response.prototype.toString = function(){
	const headerVars = Object.keys(this['headers']);
	let fullres = 'HTTP/1.1 ' + this['statusCode'] + ' ' + statusCodes[this['statusCode']] + '\r\n';
	for(let i = 0; i < headerVars.length; i++){
		fullres += headerVars[i] + ': ' + this['headers'][headerVars[i]] + '\r\n';
	}
	fullres += '\r\n' + this['body'];
	return fullres;
};
Response.prototype.send = function(statusCode, body){
	this['statusCode'] = statusCode;
	this['body'] = body;
	this.end(this.toString());
};
Response.prototype.writeHead = function(statusCode){
	this['statusCode'] = statusCode;
	const headerVars = Object.keys(this['headers']);
	let fullhead = 'HTTP/1.1 ' + statusCode + ' ' + statusCodes[statusCode] + '\r\n';
	for(let i = 0; i < headerVars.length; i++){
		fullhead += headerVars[i] + ': ' + this['headers'][headerVars[i]] + '\r\n';
	}
	fullhead += '\r\n';
	this.write(fullhead);
};
Response.prototype.redirect = function(statusCode, url){
	if(arguments.length === 1){
		this['statusCode'] = '301';
		this.setHeader('Location', statusCode);
		this.send('301', '');
	} 
	else{
		this['statusCode'] = statusCode;
		this.setHeader('Location', url);
		this.send(statusCode, '');
	}
};
Response.prototype.sendFile = function(fileName){
	const filePath = __dirname + '/../public' + fileName;
	const fileExt = fileName.split('.')[1];
	const fileType = fileExts[fileExt].split('/')[0];
	const callback = function(content, err, data){
		if(err){
			this.setHeader('Content-Type', 'text/plain');
			this.send('500', '');
		}
		else{
			this.setHeader('Content-Type', content);
			this.writeHead('200');
			this.write(data);
			this.end();
		}
	};
	if(fileType === 'image'){
		fs.readFile(filePath, callback.bind(this, fileExts[fileExt]));
	}
	else if(fileType === 'text'){
		fs.readFile(filePath, 'utf8', callback.bind(this, fileExts[fileExt]));
	}	
};

function error404(req, res){
	res.setHeader('Content-Type', 'text/plain');
	res.send('404', 'uh oh... 404 page not found!');
}
function error400(req, res){
	res.setHeader('Content-Type', 'text/plain');
	res.send('400', '400 bad request, no host');
}

function App(){
	this.server = net.createServer(this.handleConnection.bind(this));
	this.routes = {};
}
App.prototype.get = function(path, cb){
	this['routes'][path] = cb;
	if(path.length > 1 && path[path.length - 1] === '/'){
		//path ends with / add path without /
		this['routes'][path.substring(0, path.length - 1)] = cb;
	}
	else{
		this['routes'][path + '/'] = cb;
	}
};
App.prototype.listen = function(port, host){
	this.server.listen(port, host);
};
App.prototype.handleConnection = function(sock){
	sock.on('data', this.handleRequestData.bind(this, sock));
};
App.prototype.handleRequestData = function(sock, binaryData){
	const req = new Request(binaryData + '');
	const res = new Response(sock);
	if(this.routes[req['path']]){
		this.routes[req['path']](req, res);
	}
	else{
		if('Host' in req['headers']){
			error404(req, res);
		}
		else{
			error400(req, res);
		}
	}
	sock.on('close', this.logResponse.bind(this, req, res));
};
App.prototype.logResponse = function(req, res){
	console.log(req['method'] + ' ' + req['path'] + ' - ' + res['statusCode'] + ' ' + statusCodes[res['statusCode']]);
};


module.exports.Request = Request;
module.exports.Response = Response;
module.exports.App = App;