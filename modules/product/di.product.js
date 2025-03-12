const ProductRepository = require('./product.repository');
const ProductService = require('./product.service');
const ProductController = require('./product.controller');

const productRepository = new ProductRepository();

const createProductService = (categoryRepository, reviewRepository) => {
  return new ProductService(productRepository, categoryRepository, reviewRepository);
};

const createProductController = (productService) => {
  return new ProductController(productService);
};



module.exports = {
  productRepository,
  createProductService,
  createProductController,
  
};