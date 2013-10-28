var getData =  function() {
  console.log(settings.currentRoom)
  $.ajax({
    url: 'http://127.0.0.1:8080/messages',
    dataType: 'json',
    type: 'GET',
    data: {
      order: "-createdAt",
      room: settings.currentRoom
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
    $('.chatList').html('');
    for (var i=0; i < settings.pageSize; i++) {
      var datum = data[i];
      if (datum) {
        var username = $("<span class='username'></span>");
        username.text((datum ? datum.username + ": " : ""));
        var msgtext = $("<span class='msgtext'></span>");
        msgtext.text((datum ? datum.text : ""));
        var newMsg = $("<li class='msg'></li>");
        if (settings.friends[datum.username]) {
          newMsg.addClass("friendMessage");
        }
        newMsg.append(username);
        newMsg.append(msgtext);
        if (!settings.blocked[datum.username]) { $('.chatList').append(newMsg); }
      }
    }

  $('.currentRoom').text(settings.currentRoom);
  setTimeout(getData,2000);
};

var renderRooms = function(data) {
  var sortedRooms =  _(data).sortBy(function (room) {
    return room.length;
  }).reverse();
  $('.roomList').html('');
  for (var j = 0; j < sortedRooms.length; j++) {
    var room = $("<li class='room'></li>");
    var roomName = sortedRooms[j];
    $(room).attr("name", roomName);
    if (roomName && roomName.length > 18) {
      roomName = roomName.slice(0,18) + "...";
    }
    room.text(roomName);
    $('.roomList').append(room);
  }
};

var settings = {};

$(document).on("ready", function() {
  settings.pageSize = 15;
  settings.roomListSize = 5;
  settings.currentRoom = "lobby";
  settings.friends = {};
  settings.blocked = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    vars[i] = vars[i].split("=");
    settings[vars[i][0]] = vars[i][1];
  }

  $(document).on('click', '.room', function() {
    settings.currentRoom = $(this).attr('name');
  });

  $(document).on('click', '.username', function() {
    var name = $(this).text();
    name = name.slice(0, name.length - 2);
    if (!settings.friends[name]) {
      $(".friendList").append("<li class='friend'>" + name + "</li>");
      settings.friends[name] = true;
    }
  });

  $(document).on('click', '.friend', function(){
    var name = $(this).text();
    delete settings.friends[name];
    $(this).remove();
  });

  $(document).on('click', '.blocked', function(){
    var name = $(this).text();
    delete settings.blocked[name];
    $(this).remove();
  });

  $('.roomInput').keyup(function(e) {
    if(e.keyCode == 13) {
      if ($(this).val()) {
        settings.currentRoom = $(this).val();
        console.log($(this).val())
        $(this).val('');
      }
    }
  });

  $('.blockInput').keyup(function(e) {
    if(e.keyCode == 13) {
      var name = $(this).val();
      if (!settings.blocked[name]) {
        $(".blockList").append("<li class='blocked'>" + name + "</li>");
        settings.blocked[name] = true;
      }
      $(this).val('');
    }
  });

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
