# SockNet

Just because you can, doesn't mean you should.

This is a stupid experiment. Do not put this in production. Seriously. It's an
attempt to make arbitrary TCP-based Node modules run in the browser, by
using WebSocket as a transport mechanism for TCP data.

### Step 1: Boot sockproxy

    $ node bin/sockproxy 4576

This starts a server on the given port that accepts WebSocket connections and
forwards incoming data over TCP to a given host,port. For example, to create a
TCP connection to `example.com:80`:

    var ws = new WebSocket('ws://localhost:4576/example.com/80');

### Step 2: Implement the Node `net` API on top of WebSocket

There is an initial working implementation of this. By loading `socknet`, you
are monkey-patching the `net` API to create WebSocket connections instead of TCP
ones. It implements enough that this program works:

```js
var redis   = require('redis'),
    socknet = require('../lib/socknet');

socknet.setProxy('ws://localhost:4567');
socknet.patchNet();

var client = redis.createClient(6379, 'localhost', {parser: 'javascript'});

client.on('connect', function() {
  client.get('foo', function(error, value) {
    console.log(value);
    process.exit();
  });
});
```

### Step 3: Run the `redis` module in the browser I guess

I have started on this; you can make a connection to Redis from the browser;
see `examples/main.html`.


## License

(The MIT License)

Copyright (c) 2012 James Coglan

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the 'Software'), to deal in
the Software without restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

