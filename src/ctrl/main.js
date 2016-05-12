let mongoose = require('mongoose');
let Room = mongoose.model('Room');

module.exports = {
  index: (req, res, next) => {
    Room.loadAllRooms((err, rooms) => {
      if (!err && rooms) {
        res.render('home/index', {rooms: rooms});
      } else 
        next(err);    
    });
  }
}