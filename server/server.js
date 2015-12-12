var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var server = express();
var port = 3000;
var clientDir = path.join(__dirname, './client');
var indexPage = path.join(clientDir, 'pages/index.html');
var errorPage = path.join(clientDir, 'pages/error.html');
var connected = {};

server.use(bodyParser.json());
server.use(express.static(path.join(__dirname, './node_modules')));
server.use(express.static(clientDir));
server.get('/connect/:incubator', connect);
server.post('/connect', incubator);
server.use(index);
server.listen(port);

function connect(request, response) {
	incubator = request.params.incubator;
	response.send({host: connected[incubator]});
}

function incubator(request, response) {
	connected[request.body.incubator] = request.body.host;
	response.status(200);
}

function index(request, response) {
	if(request.url === '/' && request.method === 'GET')
		response.sendFile(indexPage);
	else
		response.sendFile(errorPage);
}