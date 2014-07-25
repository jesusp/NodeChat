#!/bin/env node
var express = require('express');
var app = express();
var engine = require('ejs-locals');
var http = require('http').Server(app);
var io = require("socket.io")(http);

app.configure(function () {
    app.engine('ejs', engine);
    app.set('views', __dirname + '/web/views');
    app.set('view engine', 'ejs');
    app.use(express.static(__dirname + '/web/public'));
    app.use(app.router);
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true}));
});

app.get('/', function (req, res) {
    res.render('index');
});

app.get('/chat', function (req, res) {
    res.render('index');
});

var users = ["System"];
io.on("connection", function (socket) {
    //console.log("nueva Conexion");
    socket.on("login", function (user) {
        if (users.indexOf(user) >= 0) {
            socket.emit("loginFailure");
        }else{
            users.push(user);
            socket.user = user;
            socket.emit("loginSuccess", user);
            io.emit("newMessage", {user:"System", message:"User "+ user + " has logged in!!"});
            io.emit("updateUsers", users);
        }
    });

    socket.on("disconnect", function(){
        io.emit("newMessage", {user:"System", message:"User "+ socket.user + " has logged out!!"});
        users.splice(users.indexOf(socket.user),1);
        io.emit("updateUsers", users);

    });

    socket.on("newMessage", function(message){
       // console.log("mensaje nuevo");
        io.emit("newMessage", {user: socket.user, message:message});
    });
});

http.listen(3000, function () {
    console.log("Listening on port 3000");
});
