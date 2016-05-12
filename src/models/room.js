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
  playerCount: {
    type: Number,
    min: 1,
    max: 2,
    default: 1
  }
});

RoomSchema.statics = {
  loadAllRooms: function (callback) {
    return this.find({playerCount: 1})
      .select('name password')
      .exec(callback);
  },
  loadById: function (id, callback) {
    return this.findOne({_id: id})
      .select('name password')
      .exec(callback);
  }
}

console.log("Exporting schema");
mongoose.model('Room', RoomSchema);