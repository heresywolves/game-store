const express = require('express');
const router = express.Router();

const studioController = require('../controllers/studioController');

// GET studio list
router.get('/', studioController.studios_list_get);

// GET studio add new
router.get('/create', studioController.studio_add_get);

// POST studio add new
router.post('/create', studioController.studio_add_post);

// GET studio delete 
router.get('/:id/delete', studioController.studio_delete_get);

// POST studio delete 
router.post('/:id/delete', studioController.studio_delete_post);

// GET studio update 
router.get('/:id/update', studioController.studio_update_get);

// POST studio update 
router.post('/:id/update', studioController.studio_update_post);

// GET studio details
router.get('/:id', studioController.studio_details_get);

module.exports = router;