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
    data.m = parseEmoji(data.m);
	content.push(data);
	persist.setItemSync('content', content);
}

function parseEmoji(mess) {
    var emoji = {
        ':D' : "<img src='/img/4.gif'>" ,
        ':d' : "<img src='/img/4.gif'>" ,
        ';))' : "<img src='/img/71.gif'>" ,
        ':))' : "<img src='/img/21.gif'>" ,
        ':-ss' : "<img src='/img/42.gif'>" ,
        '=))' : "<img src='/img/24.gif'>" ,
        ';)' : "<img src='/img/3.gif'>" ,
        ':x' : "<img src='/img/8.gif'>" ,
        ':P' : "<img src='/img/10.gif'>" ,
        ':p' : "<img src='/img/10.gif'>" ,
        ':>' : "<img src='/img/15.gif'>" ,
        ':@' : "<img src='/img/14.gif'>" ,
        ':-h' : "<img src='/img/104.gif'>" ,
        ':hi' : "<img src='/img/67.gif'>" ,
        ':dance' : "<img src='/img/69.gif'>" ,
        ';=' : "<img src='/img/27.gif'>" ,
        ':((' : "<img src='/img/20.gif'>" ,
        ':o' : "<img src='/img/13.gif'>" ,
        ':O' : "<img src='/img/13.gif'>" ,
        ':-"' : "<img src='/img/65.gif'>" ,
        ':b-(' : "<img src='/img/66.gif'>" ,
        ';;)' : "<img src='/img/5.gif'>" ,
    };
    
    for(var ic in emoji) {
        mess = mess.split(ic).join(emoji[ic]);
    }
    mess = parseLink(mess);
    return mess;
}

function parseLink(mess) {
    var a = mess.match(/(http|ftp|https):\/\/[\w-]+\.[\w-]+(\.[\w-]+)*/g);
    return mess.split(a).join("<a target='_blank' href='"+a+"'>Link</a>");
}

function getData(){
	var content = persist.getItemSync('content');
	content = (content == undefined) ? [] : content;
	return content;
}