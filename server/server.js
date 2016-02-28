var express = require('express');
var mongoose = require('mongoose');
var cors = require('request');
var bodyParser = require('body-parser');
var path = require('path');
var ip = require('request-ip');
var server = express();
var port = 4000;
var clientDir = path.join(__dirname, './client');
var indexPage = path.join(clientDir, 'pages/index.html');
var errorPage = path.join(clientDir, 'pages/error.html');
var connected = require('./models/connected');
var incubators = require('./models/incubators');

mongoose.connect('mongodb://localhost');
mongoose.Promise = global.Promise;

server.set('trust proxy', true);
server.use(bodyParser.json());
server.use(express.static(path.join(__dirname, './node_modules')));
server.use(express.static(clientDir));
server.use(getIp);
server.get('/dev/list', dev_list);
server.get('/connect/:incubator', connection);
server.post('/connect', connect);
server.use('/incubator', incubator, redirect);
server.use(index);
server.listen(port);

function getIp (request, response, next) {
    request.reqIp = ip.getClientIp(request);
    next();
}

function connection(request, response, next) {
    connected.findOne(request.params).exec().then(function (inc) {
        incubators.create({user: request.reqIp, host: inc.host}).then(function (doc) {
            response.send({success: true});
        }, next);
    }, next);  
}

function connect(request, response, next) {
    connected.create(request.body).then(function (doc) {
        response.send({success: true});
    }, next);
}

function dev_list(request, response, next) {
    connected.find({}).exec().then(function (incs) {
        response.send({list: incs});
    }, next);
}

function index(request, response) {
	if(request.url === '/' && request.method === 'GET')
		response.sendFile(indexPage);
	else
		response.sendFile(errorPage);
}

function incubator(request, response, next) {
    incubators.findOne({user: request.reqIp}).exec().then(function (inc) {
        request.incubator = inc.host;
        next();
    }, next);
}

function redirect(request, response) {
    var uri = "http://" + request.incubator + request.url;
    var req = {
      uri: uri,
      method: request.method,
      json: request.body 
    };
    console.log(req);
    cors(req, function (error, res, body) {
        response.send(body);
    });
}