const multer = require('multer');

class ProductAdminController {
  constructor(productService) {
    this.productService = productService;
  }

  getProducts = async (_, res) => {
    try {
      const products = await this.productService.getProducts();
      return res.json(products);
    } catch (error) {
      this.handleError(res, error, 'Failed to get products');
    }
  };

  getProductsCount = async (_, res) => {
    try {
      const productCount = await this.productService.getProductsCount();
      return res.json({ productCount });
    } catch (error) {
      this.handleError(res, error, 'Failed to get products count');
    }
  };

  addProduct = async (req, res) => {
    try {
      const product = await this.productService.addProduct(req.body, req.files);
      return res.status(201).json(product);
    } catch (error) {
      this.handleError(res, error, 'Failed to add product');
    }
  };

  editProduct = async (req, res) => {
    try {
      const updatedProduct = await this.productService.editProduct(
        req.params.id,
        req.body,
        req.files
      );
      return res.status(201).json(updatedProduct);
    } catch (error) {
      this.handleError(res, error, 'Failed to edit product');
    }
  };

  deleteProduct = async (req, res) => {
    try {
      await this.productService.deleteProduct(req.params.id);
      return res.status(204).end();
    } catch (error) {
      this.handleError(res, error, 'Failed to delete product');
    }
  };

  deleteProductImages = async (req, res) => {
    try {
      const productId = req.params.id;
      const { deletedImageUrls } = req.body;
      await this.productService.deleteProductImages(
        productId,
        deletedImageUrls
      );
      return res.status(204).end();
    } catch (error) {
      this.handleError(res, error, 'Failed to delete product images');
    }
  };

  handleError(res, error, message) {
    console.error(error);
    if (error.cause?.status) {
      return res.status(error.cause.status).json({ message: error.message });
    }
    if (error instanceof multer.MulterError) {
      return res.status(error.code).json({ message: error.message });
    }
    return res.status(500).json({ message, error: error.message });
  }
}

module.exports = ProductAdminController;
