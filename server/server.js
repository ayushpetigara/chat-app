// requiring the modeules
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

// adding the generate message
const {generateMessage, generateLocationMessage} = require('./utils/message');
//adding validate string
const {isRealString} = require('./utils/validation');
//adding users class
const {Users} = require('./utils/users');

// adding the path to the public dir to access the html
const publicPath = path.join(__dirname, '../public');
// defining the port variable
const port = process.env.PORT || 3000;
// creating the express app
var app = express();
// creating the http server to and overriding the in built express
// server to use socket io
var server = http.createServer(app);
// creating the socket
var io = socketIO(server);
var users = new Users();
// for displaying the page
app.use(express.static(publicPath));

//register an event listener
io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', (params, callback) => {
    if(!isRealString(params.name) || !isRealString(params.room)){
      return callback('Name and Room Name are required.')
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    // greeting
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    // botifying new user joined
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
    callback();
  });
  // event listener
  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id);
    if(user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }
    // io.emit an event to every single connection
    callback('');
  });

  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);
    if(user){
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });

  // disconnecting user
  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }

  });
});

// for enabling the server
server.listen(port, () => {
  console.log(`Server is up on ${port}.`);
});
