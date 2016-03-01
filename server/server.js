var express = require('express');
var mongoose = require('mongoose');
var makeRequest = require('request');
var bodyParser = require('body-parser');
var path = require('path');
var ip = require('request-ip');
var server = express();
var port = 4000;
var clientDir = path.join(__dirname, './client');
var errorPage = path.join(clientDir, 'pages/error.html');
var connected = require('./models/connected');
var incubators = require('./models/incubators');

mongoose.connect('mongodb://localhost');
mongoose.Promise = global.Promise;

server.set('trust proxy', true);
server.use(bodyParser.json());
server.use(express.static(path.join(__dirname, './node_modules')));
server.use(express.static(clientDir, {index: 'pages/index.html'}));
server.use(getIp);
server.get('/connect/:incubator', connection);
server.post('/connect', connect);
server.use('/incubator', incubator, redirect);
server.use(error);
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

function error(request, response) {
	response.sendFile(errorPage);
}

function incubator(request, response, next) {
    incubators.findOne({user: request.reqIp}).exec().then(function (inc) {
        request.incubator = inc.host;
        next();
    }, next);
}

function redirect(request, response) {
    makeRequest({
      uri: "http://" + request.incubator + request.url,
      method: request.method,
      json: request.body 
    }, function (error, res, body) {
        response.send(body);
    });
}
