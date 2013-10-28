var getData =  function() {
  $.ajax({
    url: 'http://127.0.0.1:8080/messages',
    dataType: 'json',
    type: 'GET',
    data: {
      order: "-createdAt",
      room: settings.currentRoom // property that we set with jQuery
    },
    success: function (data) {
      console.log(data);
      render(data);
    },
    error: function (data) {
      console.error('Failed to retrieve messages');
    }
  });
};

var sendData = function(data) {
  data = JSON.stringify(data);
  $.ajax({
    url: 'http://127.0.0.1:8080/messages',
    type: 'POST',
    data: data,
    success: function (data) {
      console.log('Message sent');
    },
    error: function (data) {
      console.error('Failed to send message ' + data);
    }
  });
};

var getRooms = function() {
  $.ajax({
    url: 'http://127.0.0.1:8080/getrooms',
    type: 'GET',
    success: function (data) {
      renderRooms(data);
    },
    error: function (data) {
      console.error('Failed to get rooms' + data);
    }
  });
};

var render = function (data) {
    // show messages
};

var renderRooms = function(data) {
  // show list of available rooms
};

var settings = {
  username: "me", // you can set this through a prompt, address bar query parsing, or more formal authentication
  currentRoom: "lobby"
};

$(document).on("ready", function() {
  $('.messageInput').keyup(function(e){
    if(e.keyCode == 13) {
      if ($(this).val()) {
        var message = {
          username: settings.username,
          text: $(this).val(),
          room: settings.currentRoom
        };
        sendData(message);
        $(this).val('');
      }
    }
  });

  // Page initialization.
  getRooms();
  // getRooms is not 
  getData();
});
