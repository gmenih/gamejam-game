let WSServer = require('ws').Server;
let config = require('../config');
let mongoose = require('mongoose');
let Room = mongoose.model('Room');

let server = new WSServer({port: config.socketPort});

let players = new Map();
let rplayers = new Map();

server.on('connection', (client) => {
  client.on('message', handleMessage.bind(client));
  client.on('close', handleDisconnect);
  client.on('error', handleError);

  client.send('Connection received!');
});

let commands = {
  connectPlayer: function (roomId) {
    if (typeof roomId !== undefined) {
      Room.loadById(roomId, (err, room) => {
        if (!err && room) {
          let playerId = mongoose.Types.ObjectId().toString();
          players.set(playerId, this);
          rplayers.set(this, playerId);
          this.send(JSON.stringify({c: 'connected', d: playerId}));
          room.players.push(playerId);
          room.save();
        } else {
          this.send("Error");
        } 
      });
    } else {
      this.send("No room id provided");
    }
  },
  movePlayer: function(data) {
    let playerId = rplayers.get(this);
    if (data.hasOwnProperty('location') && data.hasOwnProperty('direction')) {
      Room.loadEnemyPlayer(playerId, (err, enemyId) => {
        if (!err && enemyId) {
          let client = players.get(enemyId);
          client.send(JSON.stringify({c: 'move', d: data}));
        } else {
          this.send('Fak');
        }
      });
    } else {
      this.send('No data');
    }
  },
  stopPlayer: function(data) {
    let playerId = rplayers.get(this);
    if (data.hasOwnProperty('location')) {
      Room.loadEnemyPlayer(playerId, (err, enemyId) => {
        if (!err && enemyId) {
          let client = players.get(enemyId);
          client.send(JSON.stringify({c: 'stop', d: data}));
        } else {
          this.send(JSON.stringify({c: 'error', d: 'No enemy'}));
        }
      })
    } else {
      this.send(JSON.stringify({c: 'error', d: 'No data'}));
    }
  },
  unrecognized: function() {
    this.send('Unrecognized command');
  },
  allowAny: function(message) {
    let playerId = rplayers.get(this);
    Room.loadEnemyPlayer(playerId, (err, enemyId) => {
      if (!err && enemyId) {
        let client = players.get(enemyId);
        client.send(JSON.stringify(m));
      } else {
        this.send(JSON.stringify({c: 'error', d: 'No enemy'}));
      }
    })
  }
}

function handleMessage (msg) {
  let m;
  try {
    m = JSON.parse(msg);
  } catch (ex) {
    console.error(ex);
    return;
  }
  commands.allowAny.call(this, m);
  // if (m.hasOwnProperty('c')) {
  //   switch(m.c) {
  //     case 'connect':
  //       commands.connectPlayer.call(this, m.d);
  //       break;
  //     case 'move':
  //       commands.movePlayer.call(this, m.d);
  //       break;
  //     case 'stop':
  //       commands.stopPlayer.call(this, m.d);
  //     default:
  //       commands.unrecognized.call(this);
  //       break;
  //   }
  // } else {
  //   console.error('No command given');
  //   this.send('no command');
  // }
}

function handleDisconnect () {
  console.log('Player disconnected');
}

function handleError () {
  console.log('Error');
}