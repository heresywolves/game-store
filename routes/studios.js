const express = require('express');
const router = express.Router();

const studioController = require('../controllers/studioController');

// GET studio list
router.get('/', studioController.studios_list_get);

// GET studio add new
router.get('/create', studioController.studio_add_get);

// POST studio add new
router.post('/create', studioController.studio_add_post);

// GET studio details
router.get('/:id', studioController.studio_details_get);

module.exports = router;