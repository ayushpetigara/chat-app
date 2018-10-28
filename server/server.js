// requiring the modeules
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

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

  //emit new event
  socket.emit('newMessage', {
    from: 'AP',
    text: 'Hey, How are you doing today?',
    createdAt: 123
  });

  // event listener
  socket.on('createMessage', (message) => {
    console.log('Message created at', message);
  });
  // disconnecting user
  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});

// for enabling the server
server.listen(port, () => {
  console.log(`Server is up on ${port}.`);
});
