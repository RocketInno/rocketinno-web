'use strict';

var express = require('express');
var path = require('path');

var port = process.env.PORT || 5000;
var app = express();

app.use('/', express.static(path.resolve(__dirname, 'dist')));

function renderIndex(req, res) {
				res.sendFile(path.resolve(__dirname, './dist/index.html'));
}

app.get('/*', renderIndex);

var http = require('http').Server(app);

var server = app.listen(port, function() {
//var server = http.listen(port, function() {
				var host = server.address().address;
				var port = server.address().port;
				console.log('This express app is listening on port:' + port);
});
