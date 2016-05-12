let mongoose = require('mongoose');
let Room = mongoose.model('Room');

module.exports = {
  insert: (req, res, next) => {
    let par = req.body;
    if (par.hasOwnProperty('name')) {
      let room = new Room({name: par.name, password: par.password, players: []});
      room.save((err, room) => {
        if (!err) {
          req.flash('info', 'Room created!');
          res.redirect('/rooms/' + room._id);
        } else {
          req.flash('info', 'Room is fail');
          res.redirect('/');
        }
      });
    }
  },
  single: (req, res, next) => {
    let roomId = req.params.roomId;
    Room.loadById(roomId, (err, room) => {
      if (!err && room)
        res.render('room/single', {title: room.name, room: room});
      else
        next();
    });
  }
};