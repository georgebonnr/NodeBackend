var url = require("url");
var storage = require("./storage");
var fs = require('fs');
var path = require('path');
// we rolled our own basic query parser for this but in the future could just use queryString module

var handleRequest = function(request, response) {
  var statusCode = 404;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "text/plain";
  var responseBody = "Not Found";

  var parseQueryString = function(url){
    var options = {};
    var queryString = url.slice(url.indexOf('?')+1);
    if (queryString === url) { return options; }
    var pairs = queryString.split('&');
    for (var i=0; i<pairs.length; i++) {
      var pair = pairs[i].split('=');
      options[pair[0]] = (pair[1]).replace("+",' ');
    }
    return options;
  };

  var serveFile = function(){
    statusCode = 200;
    if (pathname === '/') {
      headers['Content-Type'] = "text/html";
      responseBody = fs.readFileSync('../client/index.html');
    } else {
      headers['Content-Type'] = (pathname === '/styles/styles.css') ? "text/css" : "text/javascript";
      responseBody = fs.readFileSync(path.join('../client',pathname));
    }
  };

  var storageAccess = function(){
    if (request.method === 'POST') {
      var data = '';
      statusCode = 201;
      request.on('data', function(chunk) {
        data += chunk;
      });
      request.on('end', function() {
        storage.set(JSON.parse(data));
        responseBody = "OK";
      });
    } else if (request.method === 'GET') {
      headers['Content-Type'] = "application/json";
      statusCode = 200;
      var options = parseQueryString(request.url);
      var messages = storage.get(options);
      responseBody = JSON.stringify(messages);
    }
  };

  var getRooms = function(){
    headers['Content-Type'] = "application/json";
    statusCode = 200;
    rooms = storage.getRooms();
    responseBody = JSON.stringify(rooms);
  };

  var router = {
    '/messages': storageAccess,
    '/getrooms': getRooms,
    '/': serveFile,
    '/styles/styles.css': serveFile,
    '/scripts/app.js': serveFile,
    '/scripts/config.js': serveFile
  };

  var pathname = url.parse(request.url).pathname;
  if (router[pathname]) {router[pathname]();}
  response.writeHead(statusCode, headers);
  response.end(responseBody);
};

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10
};

module.exports = handleRequest;
