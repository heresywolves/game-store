const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/categoryController');

// GET category list
router.get('/', categoryController.category_list_get);

// GET category add new
router.get('/create', categoryController.category_add_get);

// POST category add new
router.post('/create', categoryController.category_add_post);

// GET category delete 
router.get('/:id/delete', categoryController.category_delete_get);

// POST category delete 
router.post('/:id/delete', categoryController.category_delete_post);

// GET category details
router.get('/:id', categoryController.category_details_get);


module.exports = router;