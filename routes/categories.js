const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/categoryController');

// GET category list
router.get('/', categoryController.category_list_get);

// GET category details
router.get('/:id', categoryController.category_details_get);

module.exports = router;