// creating the client
var socket = io();
// registering client
socket.on('connect', function() {
  console.log('Connected to server');
});
// disconnecting client
socket.on('disconnect', function() {
  console.log('Disconnected from server');
});
// event listener
socket.on('newMessage', function(message) {
  console.log('New Message', message);
});
