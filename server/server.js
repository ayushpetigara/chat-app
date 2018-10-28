// requiring the modeules
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

// adding the generate message
const {generateMessage, generateLocationMessage} = require('./utils/message');
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
// for displaying the page
app.use(express.static(publicPath));

//register an event listener
io.on('connection', (socket) => {
  console.log('New user connected');
  // greeting
  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
  // botifying new user joined
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

  // event listener
  socket.on('createMessage', (message, callback) => {
    console.log('Message created', message);
    // io.emit an event to every single connection
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback('');
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitiude, coords.longitude));
  });

  // disconnecting user
  socket.on('disconnect', () => {
    console.log ('User was disconnected');
  });
});

// for enabling the server
server.listen(port, () => {
  console.log(`Server is up on ${port}.`);
});
