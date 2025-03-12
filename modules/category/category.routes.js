const express = require('express');
const router = express.Router();
const { categoryController } = require('../../config/di');

// categories
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);

module.exports = router;
