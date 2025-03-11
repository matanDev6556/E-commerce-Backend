const express = require('express');
const { uploadImage } = require('../../../middlewares/upload.mid');
const router = express.Router();

module.exports = (productAdminController) => {
  // products
  const uploadImages = uploadImage([
    { name: 'image', maxCount: 1 },
    { name: 'images', maxCount: 10 },
  ]);

  router.post('/', uploadImages, productAdminController.addProduct);
  router.get('/count', productAdminController.getProductsCount);
  router.get('/', productAdminController.getProducts);
  router.put('/:id', uploadImages, productAdminController.editProduct);
  router.delete('/:id', productAdminController.deleteProduct);
  router.delete('/:id/images', productAdminController.deleteProductImages);
  return router;
};
