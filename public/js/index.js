// creating the client
var socket = io();
// registering client
socket.on('connect', function() {
  console.log('Connected to server');
  // emitting the socket only when user is connected
  socket.emit('createMessage', {
    from: 'Ayush',
    text: 'This is me Ayush tes.'
  });
});
// disconnecting client
socket.on('disconnect', function() {
  console.log('Disconnected from server');
});
// event listener
socket.on('newMessage', function(message) {
  console.log('New Message', message);
});
