// Require Native Node.js Libraries
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var five = require("johnny-five");
var pixel = require("./lib/pixel");

var opts = {};
opts.port = process.argv[2] || "";

var board = new five.Board(opts);
var strip = null;

var fps = 60; // how many frames per second do you want to try?

var colors = [];


// ------------------------------------
// Route our Assets
// ------------------------------------

app.use('/assets/', express.static(__dirname + '/public/assets/'));

// ------------------------------------
// Route to Pages
// ------------------------------------

// Home Page
app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

// ------------------------------------
// Socket
// ------------------------------------

io.on('connection', function(socket) {

    console.log('user connected');

    socket.on('pixels', function (message) {
        colors = message;
    })

});

// ------------------------------------
// Arduino
// ------------------------------------

var randomColors = function(){
    colors = [];
    for(var i = 0; i < 60; i++){
        colors.push('#000000');
    }
};

randomColors();

board.on("ready", function() {

    console.log("Connect to board and turn lights ON");

    strip = new pixel.Strip({
        data: 6,
        length: 60,
        board: this
    });

    var count = 0;

    var blinker = setInterval(function() {
        //for(var i = 0; i < 20; i++){
        //    strip.pixel(i).color(colors[i]);
        //}

        count++;
        if(count == 60) count = 0;

        strip.pixel(count).color(colors[count]);

        strip.show();
    }, 1000/fps);
});

// ------------------------------------
// Start Server
// ------------------------------------

http.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
    var addr = http.address();
    console.log("Server started at", addr.address + ":" + addr.port);
});