var express = require('express');
var cookieParser = require('cookie-parser');
var serveStatic = require('serve-static');

var POSTS = {
  '1': {'post': 'This is the first blog post.'},
  '2': {'post': 'This is the second blog post.'},
  '3': {'post': 'This is the third blog post.'}
};

var isPreflight = function(req) {
  var isHttpOptions = req.method === 'OPTIONS';
  var hasOriginHeader = req.headers['origin'];
  var hasRequestMethod = req.headers['access-control-request-method'];
  return isHttpOptions && hasOriginHeader && hasRequestMethod;
};

var corsOptions = {};

var handleCors = function(options) {
  return function(req, res, next) {
    res.set('Access-Control-Allow-Origin', 'http://localhost:1111');
    res.set('Access-Control-Allow-Credentials', 'true');
    res.set('Access-Control-Expose-Headers', 'X-Powered-By');
    if (isPreflight(req)) {
      res.set('Access-Control-Allow-Methods', 'DELETE');
      res.set('Access-Control-Allow-Headers',
              'Timezone-Offset, Sample-Source');
      res.set('Access-Control-Max-Age', '120');
    }
    next();
  }
};

var SERVER_PORT = 9999;
var serverapp = express();
serverapp.use(cookieParser());
serverapp.use(serveStatic(__dirname));
serverapp.use(handleCors(corsOptions));
serverapp.get('/api/posts', function(req, res) {
  res.json(POSTS);
});
serverapp.delete('/api/posts/:id', function(req, res) {
  if (req.cookies['username'] === 'owner') {
    delete POSTS[req.params.id];
    res.send(204);
  } else {
    res.send(401);
  }
});
serverapp.listen(SERVER_PORT);
console.log('Started server at http://localhost:' + SERVER_PORT);

var CLIENT_PORT = 1111;
var clientapp = express();
clientapp.use(serveStatic(__dirname));
clientapp.listen(CLIENT_PORT);
console.log('Started client at http://localhost:' + CLIENT_PORT);
