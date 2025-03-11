const ProductRepository = require('./product.repository');
const ProductService = require('./product.service');
const ProductController = require('./product.controller');
const ProductAdminController = require('../admin/controllers/product.admin.controller');

const productRepository = new ProductRepository();

const createProductService = (categoryRepository, reviewRepository) => {
  return new ProductService(productRepository, categoryRepository, reviewRepository);
};

const createProductController = (productService) => {
  return new ProductController(productService);
};

const createProductAdminController = (productService) => {
  return new ProductAdminController(productService);
};

module.exports = {
  productRepository,
  createProductService,
  createProductController,
  createProductAdminController
};