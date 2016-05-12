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

function handleMessage(msg) {
  let parsedMsg;
  try {
    JSON.parse(msg);
  } catch (ex) {
    console.error(`Couldn't parse message!`);
    return;
  }
  if (parsedMsg.hasOwnProperty('c')) {
    Prototype.
  }
}

function handleError() {

}

function handleDisconnect () {

}

function respondWithError () {

}