var ip = require('ip');
var express = require('express');
var makeRequest = require('request');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var electron = require('electron');
var server = express();
var port = 3000;
var routes = require('./routes/router');
var mainWindow;

mongoose.connect('mongodb://localhost:27017/db');
mongoose.Promise = global.Promise;

server.set('trust proxy', true);
server.use(bodyParser.json());
server.use(routes);

electron.app.on('ready', function() {
    var baseURL = 'http://' + process.argv[3];
    makeRequest({
        uri: baseURL + '/connect',
        method: "POST",
        json: {
            incubator: process.argv[2],
            port: port
        }
    }, function (error, res, body) {
        if(!error) {
            mainWindow = new electron.BrowserWindow({
                frame: false,
                fullscreen: true,
                center: true
            });
            mainWindow.loadURL(baseURL)
            mainWindow.on('closed', function() {
                mainWindow = null;
            });
        }
    });
})

electron.app.on('window-all-closed', function () {
    electron.app.quit();
});

server.listen(port);
