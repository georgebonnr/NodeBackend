// storage.js

var messages = [];

var get = function(options){
  if (options && options.order) {
    return messages.sort(function(a,b) {
      if (options.order[0] === "-") {
        return b[options.order.slice(1)] - a[options.order.slice(1)];
      } else {
        return b[options.order] - a[options.order];
      }
    });
  }
  return messages;
};

var set = function(message){
  messages.push(message);
};

module.exports = {
  "get": get,
  "set": set
};