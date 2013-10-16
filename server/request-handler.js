/* You should implement your request handler function in this file.
 * But you need to pass the function to http.createServer() in
 * basic-server.js.  So you must figure out how to export the function
 * from this file and include it in basic-server.js. Check out the
 * node module documentation at http://nodejs.org/api/modules.html. */

var url = require("url");
var storage = require("./storage");
var fs = require('fs');
// unnecessary since we have our own implementation for now
// var querystring = require('querystring');

var handleRequest = function(request, response) {
  var statusCode = 404;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "text/plain";
  var responseBody = "Not Found";

  var parseQueryString = function(url){
    var options = {};
    var queryString = url.slice(url.indexOf('?')+1);
    if (queryString === url) {
      return options;
    }
    var pairs = queryString.split('&');
    for (var i=0; i<pairs.length; i++) {
      var pair = pairs[i].split('=');
      options[pair[0]] = pair[1];
    }
    console.log(url);
    console.log(options);
    return options;
  };

  var serveFile = function(){
    statusCode = 200;
    if (pathname === '/' || pathname === '') {
      headers['Content-Type'] = "text/html";
      responseBody = fs.readFileSync('../client/index.html');
    } else {
      headers['Content-Type'] = (pathname === '/styles/styles.css') ? "text/css" : "text/javascript";
      responseBody = fs.readFileSync('../client/' + pathname);
    }
  };

  var storageAccess = function(){
    if (request.method === 'POST') {
      var fullBody = '';
      statusCode = 201;
      request.on('data', function(chunk) {
        fullBody += chunk;
      });
      request.on('end', function() {
        storage.set(JSON.parse(fullBody));
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

  var router = {
    '/classes/chatterbox': storageAccess,
    '/classes/room1': storageAccess,
    '/': serveFile,
    '/styles/styles.css': serveFile,
    '/scripts/config.js': serveFile,
    '/scripts/app.js': serveFile
  };

  var pathname = url.parse(request.url).pathname;
  // console.log(pathname);
  // console.log(router[pathname]);
  router[pathname]();

  response.writeHead(statusCode, headers);
  response.end(responseBody);
};



var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

module.exports = handleRequest;