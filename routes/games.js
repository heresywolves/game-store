var express = require('express');
var router = express.Router();

const game_controller = require('../controllers/gameController');

/* GET games listing. */
router.get('/', game_controller.games_list_get );

/* GET game details. */
router.get('/:id', game_controller.game_details_get );

module.exports = router;
