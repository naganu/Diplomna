var ip = require('ip');
var express = require('express');
var makeRequest = require('request');
var bodyParser = require('body-parser');
var server = express();
var port = 3000;
var routes = require('./routes/router');

server.set('trust proxy', true);
server.use(bodyParser.json());
server.use(routes);

server.listen(port);

makeRequest({
    uri: `http://${process.argv[3]}/connect`,
    method: "POST",
    json: {incubator: process.argv[2], host: `${ip.address()}:${port}`}
}, function (error, res, body) { console.log(res.statusMessage); });
