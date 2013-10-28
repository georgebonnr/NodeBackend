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

$(document).on("ready", function() {

  // Client-side logic goes here!

  // Page initialization.
  getRooms();
  getData();
});
