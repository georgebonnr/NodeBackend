var fs = require('fs');
var messages = {
  lobby: []
};

var get = function(options){
  if (messages[options.room] === undefined) { messages[options.room] = []; }
  var roomMessages = messages[options.room];
  if (options.order) {
    return roomMessages.sort(function(a,b) {
      if (options.order[0] === "-") { return b[options.order.slice(1)] - a[options.order.slice(1)]; }
      return a[options.order] - b[options.order];
    });
  }
  return roomMessages;
};

var set = function(message){
  message.createdAt = new Date();
  messages[message.room] ? messages[message.room].push(message) : messages[message.room] = [message];
  fs.appendFile("log.txt", JSON.stringify(message));
};

var getRooms = function() {
  return Object.keys(messages);
};

module.exports = {
  "get": get,
  "set": set,
  "getRooms": getRooms
};