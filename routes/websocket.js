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

  // client.send('Connection received!');
});

let commands = {
  connectPlayer: function (roomId) {
    if (typeof roomId !== undefined) {
      Room.loadById(roomId, (err, room) => {
        if (!err && room) {
          let playerId = mongoose.Types.ObjectId().toString();
          players.set(playerId, this);
          rplayers.set(this, playerId);
          room.players.push(playerId);
          room.save();
          if (room.players.length === 2) {
            Room.loadEnemyPlayer(playerId, (err, enemyId) => {
              if (!err && enemyId) {
                let client = players.get(enemyId);
                client.send(JSON.stringify({c: 'start', d: 'player1'}));
                this.send(JSON.stringify({c: 'start', d: 'player2'}));
              } else {
                this.send(JSON.stringify({c: 'error', d: 'No enemy'}));
              }
            });
          } else 
            this.send(JSON.stringify({c: 'wait', d: 'No enemy'}));
        } else {
          this.send(JSON.stringify({c: 'error', d: 'Room doesnt exist'}));
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
          this.send(JSON.stringify({c: 'wait', d: 'No enemy'}));
        }
      });
    } else {
      this.send(JSON.stringify({c: 'error', d: 'No data'}));
    }
  },
  playerInput: function(data) {
    let playerId = rplayers.get(this);
    if (data.hasOwnProperty('location') && data.hasOwnProperty('input')) {
      Room.loadEnemyPlayer(playerId, (err, enemyId) => {
        if (!err && enemyId) {
          console.timeEnd('request');
          let client = players.get(enemyId);
          client.send(JSON.stringify({c: 'input', d: data}));
        } else {
          this.send(JSON.stringify({c: 'wait', d: 'No enemy'}));
        }
      });
    } else {
      this.send(JSON.stringify({c: 'error', d: 'No data'}));
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
      });
    } else {
      this.send(JSON.stringify({c: 'error', d: 'No data'}));
    }
  },
  playerShoot: function(data) {
    let playerId = rplayers.get(this);
    if (data.hasOwnProperty('location')
      && data.hasOwnProperty('direction')) {
      Room.loadEnemyPlayer(playerId, (err, enemyId) => {
        if (!err && enemyId) {
          let client = players.get(enemyId);
          client.send(JSON.stringify({c: 'shoot', d: data}));
        } else {
          this.send(JSON.stringify({c: 'error', d: 'No enemy found'}));
        }
      });
    } else {
      this.send(JSON.stringify({c:'error', d: 'No data'}));
    }
  },
  playerDead: function() {
    let playerId = rplayers.get(this);
    Room.loadEnemyPlayer(playerId, (err, enemyId) => {
      if (!err && enemyId) {
        let client = players.get(enemyId);
        client.send(JSON.stringify({c: 'dead', d: data}));
      } else {
        this.send(JSON.stringify({c: 'error', d: 'No enemy found'}));
      }
    });
  },
  playerRespawn: function(data) {
    let playerId = rplayers.get(this);
    if (data.hasOwnProperty('location')) {
      Room.loadEnemyPlayer(playerId, (err, enemyId) => {
        if (!err && enemyId) {
          let client = players.get(enemyId);
          client.send(JSON.stringify({c: 'respawn', d: data}));
        } else {
          this.send(JSON.stringify({c: 'error', d: 'No enemy found'}));
        }
      });
    } else {
      this.send(JSON.stringify({c:'error', d: 'No location'}));
    }
  },
  playerPickFlag: function() {
    let playerId = rplayers.get(this);
    Room.loadEnemyPlayer(playerId, (err, enemyId) => {
      if (!err && enemyId) {
        let client = players.get(enemyId);
        client.send(JSON.stringify({c: 'pickup', d: null}));
      } else {
        this.send(JSON.stringify({c: 'error', d: 'No enemy found'}));
      }
    });
  },
  playerWin: function() {
    let playerId = rplayers.get(this);
    Room.loadEnemyPlayer(playerId, (err, enemyId) => {
      if (!err && enemyId) {
        let client = players.get(enemyId);
        client.send(JSON.stringify({c: 'win', d: null}));
      } else {
        this.send(JSON.stringify({c: 'error', d: 'No enemy found'}));
      }
    });
  },
  unrecognized: function() {
    this.send(JSON.stringify({c: 'error', d: 'Unknown command'}));
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
  console.time('request');
  if (m.hasOwnProperty('c')) {
    switch(m.c) {
      case 'connect':
        commands.connectPlayer.call(this, m.d);
        break;
      case 'move':
        commands.movePlayer.call(this, m.d);
        break;
      case 'input':
        commands.playerInput.call(this, m.d);
        break;
      case 'stop':
        commands.stopPlayer.call(this, m.d);
        break;
      case 'shoot':
        commands.playerShoot.call(this, m.d);
        break;
      case 'dead':
        commands.playerDead.call(this, m.d);
        break;
      case 'respawn':
        commands.playerRespawn.call(this, m.d);
        break;
      case 'pickup':
        commands.playerPickFlag.call(this, m.d);
        break;
      case 'win':
        commands.playerWin.call(this, m.d);
        break;
      default:
        commands.allowAny.call(this, m);
        break;
    }
  } else {
    console.error('No command given');
    this.send(JSON.stringify({c: 'error', d: 'No enemy'}));
  }
}

function handleDisconnect () {
  console.log('Player disconnected');
}

function handleError () {
  console.log('Error');
}