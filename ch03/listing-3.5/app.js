var express = require('express');

var POSTS = {
  '1': {'post': 'This is the first blog post.'},
  '2': {'post': 'This is the second blog post.'},
  '3': {'post': 'This is the third blog post.'}
};

var handleCors = function(req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');
  next();
};

var SERVER_PORT = 9999;
var serverapp = express();
serverapp.use(express.static(__dirname));
serverapp.use(handleCors);
serverapp.get('/api/posts', function(req, res) {
  res.json(POSTS);
});
serverapp.listen(SERVER_PORT);
console.log('Started server at http://localhost:' + SERVER_PORT);

var CLIENT_PORT = 1111;
var clientapp = express();
clientapp.use(express.static(__dirname));
clientapp.listen(CLIENT_PORT);
console.log('Started client at http://localhost:' + CLIENT_PORT);
