/* You should implement your request handler function in this file.
 * But you need to pass the function to http.createServer() in
 * basic-server.js.  So you must figure out how to export the function
 * from this file and include it in basic-server.js. Check out the
 * node module documentation at http://nodejs.org/api/modules.html. */

var url = require("url");
var storage = require("./storage");

var handleRequest = function(request, response) {
  console.log(request.method);
  var statusCode = 200;
  var pathname = url.parse(request.url).pathname;
  var headers = defaultCorsHeaders;
  console.log("Request for " + pathname + " received.");
  headers['Content-Type'] = "text/plain";
  response.writeHead(statusCode, headers);
  response.end('hi there!');
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