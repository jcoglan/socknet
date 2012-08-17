var WebSocket = require('faye-websocket'),
    http      = require('http'),
    net       = require('net'),
    url       = require('url');

var SockProxy = function(port) {
  this._port = port;
};

SockProxy.prototype.start = function() {
  var server = http.createServer(function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('SockProxy!');
  });
  server.addListener('upgrade', function(request, socket, head) {
    new Connection(request, socket, head);
  });
  server.listen(this._port);
};

var Connection = function(request, socket, head) {
  this._frontend = new WebSocket(request, socket, head);
  var endpoint   = url.parse(this._frontend.url).path.split(/\/+/);
  this._backend  = net.createConnection(endpoint[2], endpoint[1]);
  this._queue    = [];
  var self       = this;

  this._backendState = 'connecting';

  this._backend.addListener('connect', function() {
    self._backendState = 'connected';
    var message;
    while (message = self._queue.shift())
      self._backend.write(message);
  });
  
  ['close', 'error'].forEach(function(event) {
    self._backend.addListener(event, function() {
      self._backendState = 'closed';
      self._frontend.close();
    });
  });

  this._backend.addListener('data', function(data) {
    self._frontend.send(data.toString());
  });

  this._frontend.onmessage = function(event) {
    if (self._backendState === 'connecting')
      self._queue.push(event.data);
    else if (self._backendState === 'connected')
      self._backend.write(event.data);
  };

  this._frontend.onclose = function() {
    self._backend.end();
  };
};

module.exports = SockProxy;

