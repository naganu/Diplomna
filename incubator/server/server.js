var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var ip = require('ip');
var http = require('http');
var server = express();
var port = 3000;
//var routes = require('./routes/router');
var clientDir = path.join(__dirname, './../client');
var indexPage = path.join(clientDir, 'pages/index.html');
var errorPage = path.join(clientDir, 'pages/error.html');

server.set('trust proxy', true);
server.use(bodyParser.json());
server.use(express.static(path.join(__dirname, './../node_modules')));
server.use(express.static(clientDir));
//server.use(routes);
server.post('/req', function (request, response) {
   response.send(request.body); 
});
server.use(index);
server.listen(port);
connect();

function index(request, response) {
	if(request.url === '/' && request.method === 'GET')
		response.sendFile(indexPage);
	else
		response.sendFile(errorPage);
}

function connect() {
	var myIp = ip.address();
	var data = {incubator: process.argv[2], host: `${myIp}:${port}`};
    var postData = JSON.stringify(data);
    var host = process.argv[3].split(':');
    
	var options = {
		hostname: host[0],
        port: host[1],
		path: "/connect",
		method: "POST",
		headers: {
		    'Content-Type': 'application/json',
		    'Content-Length': postData.length
  		}
	};

	var request = http.request(options, handle);
	request.write(postData);
	request.end();

	function handle(response) {
		console.log('STATUS: ' + response.statusCode);
	}
}
