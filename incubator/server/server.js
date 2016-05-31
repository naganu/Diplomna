var ip = require('ip');
var express = require('express');
var makeRequest = require('request');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var server = express();
var port = 3000;
var routes = require('./routes/router');

mongoose.connect('mongodb://localhost:27017/db');
mongoose.Promise = global.Promise;

server.set('trust proxy', true);
server.use(bodyParser.json());
server.use(routes);

server.listen(port);

makeRequest({
    uri: `http://${process.argv[3]}/connect`,
    method: "POST",
    json: {incubator: process.argv[2], port: port}
}, function (error, res, body) { console.log(res.statusMessage); });
