let express = require('express');
let config = require('../config');
/** Controllers required */
let main = require('../src/ctrl/main');
let rooms = require('../src/ctrl/rooms');

let router = express.Router();

router.get('/', main.index);

router.put('/rooms', rooms.insert);

router.get('/rooms/:roomId', rooms.single);
router.get('/join/:roomId', rooms.single);
router.get('/test', (req, res) => {
  require('mongoose').model('Room').loadEnemyPlayer("5734ebf5073b2c800b7cef95", (err, enemy) => {
    console.log(err);
    res.send('"' + enemy + '"');
  })
})

module.exports = router;