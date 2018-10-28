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
  var li = jQuery('<li></li');
  li.text(`${message.from}: ${message.text}`);
  // adds as the last child so adds at the bottom
  jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function (e) {
  //prevents the refreshing of browser
  e.preventDefault();
  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function(){

  });
});
