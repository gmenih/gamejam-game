let WSServer = require('ws').Server;
let config = require('../config');
let mongoose = require('mongoose');

let server = new WSServer({port: config.socketPort});

server.on('connection', (client) => {
  client.on('message', handleMessage);
  client.on('close', handleDisconnect);
  client.on('error', handleError);

  client.send('Connection received!');
});
