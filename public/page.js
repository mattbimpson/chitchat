function disableMessages() {
  $("#message-input").hide();
  $("#btnSend").hide();
}
function showMessages() {
  $("#message-input").show();
  $("#btnSend").show();
}
function disableUsername() {
  $("#nickname").hide();
  $("#btnNickname").hide();
}
function showUsername() {
  $("#nickname").show();
  $("#btnNickname").show();
}
$(function () {
    var socket = io();
    disableMessages();
    $('#sendForm').submit(function(){
      socket.emit('chat message', $('#message-input').val());
      $('#message-input').val('');
      return false;
    });
    socket.on('chat message', function(msg){
      $('#messages').append($('<li>').text(msg));
      $('#bottom')[0].scrollIntoView(false);
    });
    socket.on('notification', function(msg) {
      $('#messages').append($('<li>').text(msg));
    });
    $('#setNicknameForm').submit(function() {
      socket.emit('send-nickname', $('#nickname').val());
      $('#nickname').val('');
      showMessages();
      disableUsername();
      $("#header").html("Messages:");
      return false;
    });
});
