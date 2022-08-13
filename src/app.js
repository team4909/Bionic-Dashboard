'use strict';
const http = require('http');
const ntClient = require('wolfbyte-networktables');

const hostname = '127.0.0.1';
const roborio_hostname = "localhost"; // roborio-4909.local or something 
const port = 3000;

const client = new ntClient.Client();

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('Hello World\n')
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})

client.start(
  (isConnected, error) => {console.log({isConnected, error})},
  roborio_hostname
);
