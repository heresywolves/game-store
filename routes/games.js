var express = require('express');
var router = express.Router();
const multer = require('multer');
const upload = multer({dest: 'public/images/'});

const game_controller = require('../controllers/gameController');

/* GET games listing. */
router.get('/', game_controller.games_list_get );

// GET games add new
router.get('/create', game_controller.game_add_get);

// POST games add new
router.post('/create', upload.single('image'), game_controller.game_add_post);

// GET games delete 
router.get('/:id/delete', game_controller.game_delete_get);

// POST games delete 
router.post('/:id/delete', game_controller.game_delete_post);

/* GET game details. */
router.get('/:id', game_controller.game_details_get );

module.exports = router;
