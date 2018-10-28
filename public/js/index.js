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

socket.on('newLocationMessage', function(message) {
  var li = jQuery('<li></li');
  var a = jQuery('<a target="_blank">My current location</a>');
  li.text(`${message.from}: `);
  a.attr('herf', message.url);
  li.append(a);
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function() {
  if(navigator.geolocation){
    return alert('Geolocation not support by your browser');
  }
  navigator.geolocation.getCurrentPosition(function(position) {
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitiude,
      longitude: position.coords.longitude
    });
  }, function() {
    alert('Unable to fetch location.')
  });
});
