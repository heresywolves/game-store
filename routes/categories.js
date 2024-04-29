const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/categoryController');

// GET category list
router.get('/', categoryController.category_list_get);

// GET category add new
router.get('/new_category', categoryController.category_add_get);

// GET category details
router.get('/:id', categoryController.category_details_get);

module.exports = router;