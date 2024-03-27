var express = require('express');
var router = express.Router();

const game_controller = require('../controllers/gameController');

/* GET games listing. */
router.get('/', game_controller.games );

module.exports = router;
