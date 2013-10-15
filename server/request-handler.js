/* You should implement your request handler function in this file.
 * But you need to pass the function to http.createServer() in
 * basic-server.js.  So you must figure out how to export the function
 * from this file and include it in basic-server.js. Check out the
 * node module documentation at http://nodejs.org/api/modules.html. */

var url = require("url");
var storage = require("./storage");
var querystring = require('querystring');

var handleRequest = function(request, response) {
  var statusCode;
  var headers = defaultCorsHeaders;
  var responseBody = "Not Found";
  var urls = {
    '/classes/chatterbox': true,
    '/classes/room1': true
  };
  headers['Content-Type'] = "text/plain";
  var pathname = url.parse(request.url).pathname;

  if (!urls[pathname]) {
    statusCode = 404;
  }
  else if (request.method === 'POST') {
    var fullBody = '';
    statusCode = 201;
    request.on('data', function(chunk) {
      // append the current chunk of data to the fullBody variable
      // fullBody += chunk.toString(); // `toString` is unnecessary due to use of `+=`
      fullBody += chunk;
    });

    request.on('end', function() {
      // request ended -> do something with the data
      // parse the received body data
      // var decodedBody = querystring.parse(fullBody);
      var decodedBody = JSON.parse(fullBody);
      // output the decoded data to the HTTP response
      storage.set(decodedBody);
      responseBody = "OK";
    });

  } else if (request.method === 'GET') {
    statusCode = 200;
    var options = parseQueryString(request.url);
    var messages = storage.get(options);
    responseBody = JSON.stringify(messages);
    headers['Content-Type'] = "application/json";
  }

  response.writeHead(statusCode, headers);
  response.end(responseBody);
};

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

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

module.exports = handleRequest;

// var requestListener = function (request, response) {

//   /* Request is an http.ServerRequest object containing various data
//    * about the client request - such as what URL the browser is
//    * requesting. */
//   console.log("Serving request type " + request.method + " for url " + request.url);

//   /* "Status code" and "headers" are HTTP concepts that you can
//    * research on the web as and when it becomes necessary. */
//   var statusCode = 200;

//   /* Without this line, this server wouldn't work.  See the note
//    * below about CORS. */
//   var headers = defaultCorsHeaders;

//   headers['Content-Type'] = "text/plain";

//    Response is an http.ServerRespone object containing methods for
//    * writing our response to the client. Documentation for both request
//    * and response can be found at
//    * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html
//   response.writeHead(statusCode, headers);
//   /* .writeHead() tells our server what HTTP status code to send back
//    * to the client, and what headers to include on the response. */

//   /* Make sure to always call response.end() - Node will not send
//    * anything back to the client until you do. The string you pass to
//    * response.end() will be the body of the response - i.e. what shows
//    * up in the browser.*/
//   response.end("Hello, World!");
// };