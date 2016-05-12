let express = require('express');
let config = require('../config');
/** Controllers required */
let main = require('../src/ctrl/main');

let router = express.Router();

router.get('/', main.index);

module.exports = router;