# SockProxy

Just because you can, doesn't mean you should.

This is a stupid experiment. Do not put this in production. Seriously. It's an
attempt to make arbitrary TCP-based Node modules run in the browser, by
using WebSocket as a transport mechanism for TCP data.

## Step 1: Boot sockproxy

    $ node bin/sockproxy 4576

This starts a server on the given port that accepts WebSocket connections and
forwards incoming data over TCP to a given host,port. For example, to create a
TCP connection to `example.com:80`:

    var ws = new WebSocket('ws://localhost:4576/example.com/80');

## Step 2: Implement the Node `net` API on top of WebSocket

TODO

## Step 3: Run the `redis` module in the browser I guess

TODO

