const express = require('express');
const router = express.Router();

module.exports = (categoryController) => {
    // categories
    router.get('/', categoryController.getCategories);
    router.put('/:id', categoryController.getCategoryById);
    
  
    return router;
  };
  