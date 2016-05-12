let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let RoomSchema = new Schema({
  name: {
    type: String,
    min: 3,
    max: 64
  },
  password: {
    type: String,
    min: 3,
    max: 64
  },
  players: [{
    type: String,
    default: ''
  }]
});

RoomSchema.statics = {
  loadAllRooms: function (callback) {
    return this.find({$where: "this.players.length < 2"})
      .select('name password players')
      .exec(callback);
  },
  loadById: function (id, callback) {
    return this.findOne({_id: id})
      .select('name password players')
      .exec(callback);
  },
  loadEnemyPlayer: function(playerId, callback) {
    return this.findOne({players: playerId})
      .select('players')
      .exec((err, data) => {
        if (!err && data) {
          let enemy = data.players.reduce((p, c) => {
            if (c !== playerId){
              p = c;
              return c;
            }
            else
              return p;
          }, '');
          callback(null, enemy);
        } else 
          callback(err, data);
      })
  }
}

mongoose.model('Room', RoomSchema);