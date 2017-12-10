const net = require('net');
const HOST = '127.0.0.1';
const PORT = 8080;

function createResponse(status, body){
	return `HTTP/1.1 ${status} OK
Content-Type: text/html

${body}`;

}

const server = net.createServer((sock) => {
	sock.on('data', (binaryData)=>{
		console.log(binaryData + '');
		sock.write(createResponse(200, '<em>Hello</em> <strong>World</strong>'));
		sock.end();
	});
});

server.listen(PORT, HOST);