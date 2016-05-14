let WSServer = require('ws').Server;
let config = require('../config');
let mongoose = require('mongoose');
let Room = mongoose.model('Room');

module.exports = function (expressServer) {
  // Listen on same port as express
  let server = WSServer({server: expressServer});
  // This map saves all the clients with their unique ids
  let clients = new Map();
  let rooms = new Map();
  let broadcastToRoom = function (roomId, message) {
    rooms.get(roomId).forEach(playerId => clients.get(playerId).sendJSON(message));
  }
  let getEnemyPlayer = function(roomId, clientId) {
    return rooms.get(roomId).reduce((y, x) => {
      if (x !== clientId)
        return x;
      return y;
    }, '');
  }
  server.on('connection', (client) => {
    // Client unique identifier
    let clientId = mongoose.Types.ObjectId().toString();
    clients.set(clientId, client);
    // Add id to client
    client.id = clientId;
    // So i dont have to stringify
    client.sendJSON = function (message) {
      return client.send(JSON.stringify(message));
    }
    // handle events
    client.on('message', handleMessage.bind(client));
    client.on('close', handleDisconnect.bind(client));
    client.on('error', handleError.bind(client));

    client.sendJSON({c:'ack', d: 'Your id is ' + clientId});
  });
  /** @type {Object} Functions that handle messages */
  let commands = {
    connectPlayer: function (roomId) {
      Room.loadById(roomId, (err, room) => {
        if (!err && room) {
          room.id = room._id.toString();
          let playerId = this.id;
          this.roomId = room.id;
          clients.set(playerId, this);
          room.players.push(playerId);
          room.save();
          // If player already in room
          if (rooms.has(room.id)) {
            console.log("Adding player %s to room %s", playerId, room._id);
            rooms.get(room.id).push(playerId);
            this.sendJSON({c: 'start', d: 'player2'});
            clients.get(getEnemyPlayer(room.id, playerId)).sendJSON({c: 'start', d: 'player1'});
            // broadcastToRoom(room.id, {c: 'start', d: null});
          } else {
            console.log("Creating new room with player %s", playerId);
            let players = [playerId];
            // Add this so I can broadcast
            rooms.set(room.id, players);
            this.sendJSON({c: 'wait', d: null});
          }
        } else {
          this.sendJSON({c: 'error', d: {message: 'Room is full or doesnt exist'}});
        }
        console.timeEnd('messageRequest');
      });
    }, 
    movePlayer: function (data) {
      if (data.hasOwnProperty('location') && data.hasOwnProperty('direction')) {
        try {
          let enemyClient = clients.get(getEnemyPlayer(this.roomId, this.id));
          enemyClient.sendJSON({c: 'move', d: data});
        } catch (ex) {
          this.sendJSON({c: 'error', d: {message: 'There is no enemy player'}});
        }
      } else {
        this.sendJSON({c: 'error', d: {message: 'Incorrect move'}});
      }
      console.timeEnd('messageRequest');
    },
    playerInput: function (data) {
      if (data.hasOwnProperty('location') && data.hasOwnProperty('input')) {
        try {
          let enemyClient = clients.get(getEnemyPlayer(this.roomId, this.id));
          enemyClient.sendJSON({c: 'input', d: data});
        } catch (ex) {
          this.sendJSON({c: 'error', d: {message: 'There is no enemy player'}});
        }
      } else {
        this.sendJSON({c: 'error', d: {message: 'Bad input'}})
      }
      console.timeEnd('messageRequest');
    },
    playerPickup: function (data) {
      try {
        let enemyClient = clients.get(getEnemyPlayer(this.roomId, this.id));
        enemyClient.sendJSON({c: 'pickup', d: data});
      } catch (ex) {
        this.sendJSON({c: 'error', d: {message: 'There is no enemy player'}});
      }
      console.timeEnd('messageRequest');
    },
    playerDead: function (data) {
      try {
        let enemyClient = clients.get(getEnemyPlayer(this.roomId, this.id));
        enemyClient.sendJSON({c: 'dead', d: data});
      } catch (ex) {
        this.sendJSON({c: 'error', d: {message: 'There is no enemy player'}});
      }
      console.timeEnd('messageRequest');
    },
    playerWin: function (data) {
      try {
        let enemyClient = clients.get(getEnemyPlayer(this.roomId, this.id));
        enemyClient.sendJSON({c: 'win', d: data});
      } catch (ex) {
        this.sendJSON({c: 'error', d: {message: 'There is no enemy player'}});
      }
      console.timeEnd('messageRequest');
    }
  }

  let handleMessage = function (message) {
    console.time('messageRequest');
    console.log('%s: %s', this.id, message);
    let d;
    try {
      d = JSON.parse(message);
    } catch (ex) {
      console.error("Couldn't parse JSON");
    }
    if (!d.hasOwnProperty('c'))
      return;
    switch (d.c) {
      case 'connect':
        commands.connectPlayer.call(this, d.d);
      break;
      case 'move':
        commands.movePlayer.call(this, d.d);
      break;
      case 'input':
        commands.playerInput.call(this, d.d);
      break;
      case 'pickup':
        commands.playerPickup.call(this, d.d);
      break;
      case 'dead':
        commands.playerDead.call(this, d.d);
      break;
      case 'win':
        commands.playerWin.call(this, d.d);
      break;
      default:
        commands.passThru.call(this, d.d);
        console.log('Unknown command: %s', d.c);
      break;
    }
  }

  let handleError = function (error) {
    console.error('There was an error');
    console.error(client, error);
  }

  let handleDisconnect = function(code) {
    let clientId = this.id;
    let roomId = this.roomId;
    try {
      rooms.get(roomId).splice(rooms.get(roomId).indexOf(clientId), 1);
      console.log('%s has disconnected.', clientId);
      clients.delete(clientId);
      broadcastToRoom(roomId, {c: 'left', d: {message: 'Enemy player left'}});
    } catch (ex) {
      console.log("%s wasn't in a room.", clientId);
    }
  }
}