var log  = function(xx){console.log(xx);};

var express = require('express');
var app = require('express')();
var fs = require('fs');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var persist = require('node-persist');

persist.initSync();

app.get('/', function (req, res) {
    fs.createReadStream('./templates/index.html').pipe(res);
});

var path = require('path');
app.use(express.static(path.join(__dirname + '/templates/')));

http.listen(6969, function () {
    console.log('Waiting for love:6969');
});

io.on('connection', function (socket) {
    socket.on('sendMessage', function (data) {
        if(data.m == '/clear'){
            clearData();
        } else {
            pushData(data);
            io.emit('sendMessage', data);
        }
    });
    socket.on('loadMessage', function () {
        loadData();
    });
});

function clearData(){
    persist.setItemSync('content', []);
}

function loadData() {
	var content = getData();
	io.emit('loadMessage', content);
}

function pushData(data) {
	var content = getData();
	content.push(data);
	persist.setItemSync('content', content);
}

function getData(){
	var content = persist.getItemSync('content');
	content = (content == undefined) ? [] : content;
	return content;
}