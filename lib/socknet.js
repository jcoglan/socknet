if (typeof WebSocket === 'undefined' && typeof require === 'function')
  var WebSocket = require('faye-websocket').Client;

var SockNet = {
  setProxy: function(address) {
    this._proxyAddress = address;
  },
  
  openSocket: function(host, port) {
    var endpoint = this._proxyAddress + '/' + host + '/' + port;
    if (typeof net === 'object') net.createConnection = net._originalCreateConnection;
    var ws = new WebSocket(endpoint);
    if (typeof net === 'object') net.createConnection = SockNet.createConnection;
    return ws;
  },
  
  createConnection: function(port, host) {
    return new SockNet.Connection(host, port);
  }
};

SockNet.Buffer = function(string) {
  this._string = string;
  this.length  = string.length;
  for (var i = 0, n = this.length; i < n; i++)
    this[i] = string.charCodeAt(i);
};

SockNet.Buffer.prototype.toString = function() {
  return this._string;
};

SockNet.Connection = function(host, port) {
  this._socket    = SockNet.openSocket(host, port);
  this._listeners = {};
  this.writable   = true;
  
  var self = this;
  
  this._socket.onopen = function() {
    self.emit('connect');
  };
  this._socket.onmessage = function(event) {
    var buffer = new SockNet.Buffer(event.data);
    self.emit('data', buffer);
  };
};

SockNet.Connection.prototype.addListener =
SockNet.Connection.prototype.on = function(type, callback) {
  var list = this._listeners[type] = this._listeners[type] || [];
  list.push(callback);
};

SockNet.Connection.prototype.emit = function(type, event) {
  var list = this._listeners[type];
  if (!list) return;
  for (var i = 0, n = list.length; i < n; i++)
    list[i](event);
};

SockNet.Connection.prototype.setNoDelay = function() {};
SockNet.Connection.prototype.setTimeout = function() {};

SockNet.Connection.prototype.write = function(buffer) {
  if (typeof buffer !== 'string') buffer = buffer.toString();
  this._socket.send(buffer);
};


var net = require('net');
net._originalCreateConnection = net.createConnection;
net.createConnection = SockNet.createConnection;

module.exports = SockNet;

