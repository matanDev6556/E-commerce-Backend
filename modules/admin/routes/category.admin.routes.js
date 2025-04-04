const express = require('express');
const { uploadImage } = require('../../../middlewares/upload.mid');
const router = express.Router();

module.exports = (categoryAdminController) => {
  // categories
  router.post(
    '/',
    uploadImage([{ name: 'image', maxCount: 1 }]),
    categoryAdminController.addCategory
  );
  router.put('/:id', categoryAdminController.editCategory);
  router.delete('/:id', categoryAdminController.deleteCategory);

  return router;
};
