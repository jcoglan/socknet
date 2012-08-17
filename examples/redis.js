var redis   = require('redis'),
    socknet = require('../lib/socknet');

socknet.setProxy('ws://localhost:4567');

var client = redis.createClient(6379, 'localhost', {parser: 'javascript'});

client.on('connect', function() {
  client.get('foo', function(error, value) {
    console.log(value);
    process.exit();
  });
});

