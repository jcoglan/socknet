var WebSocket = require('faye-websocket');

var ws = new WebSocket.Client('ws://localhost:4567/localhost/' + process.argv[2]);

var request = 'GET / HTTP/1.1\r\n' +
              'Host: localhost:9292\r\n' +
              '\r\n';

ws.onopen = function() {
  ws.send(request);
};

ws.onmessage = function(event) {
  process.stdout.write(event.data);
  process.exit();
};

