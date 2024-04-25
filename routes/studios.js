const express = require('express');
const router = express.Router();

const studioController = require('../controllers/studioController');

// GET category list
router.get('/', studioController.studios_list_get);

// GET category details
router.get('/:id', studioController.studio_details_get);

module.exports = router;