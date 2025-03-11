const ErrorHandler = require('../../helpers/handle_controllers_error');

class ProductController {
  constructor(productService) {
    this.productService = productService;
  }

 
  getProducts = async (req, res) => {
    try {
        
      const { 
        page = 1, 
        limit = 10, 
        search, 
        category, 
        criteria
      } = req.query;
      
      // Call service with all filtering options
      const result = await this.productService.getProducts({
        page: parseInt(page),
        limit: parseInt(limit),
        isAdmin: false,
        searchText: search,
        category,
        criteria
      });
      
      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      // Error handling logic
      const status = error.cause?.status || 500;
      ErrorHandler.handleError(error, res, `Error in getProducts: ${error.message}`);
    }
  };

  getProductById = async (req, res) => {
    try {
      const product = await this.productService.getProductById(req.params.id);
      return res.json(product);
    } catch (error) {
      ErrorHandler.handleError(error, res, `Error in getProductById: ${error.message}`);
    }
  };

  searchProducts = async (_, res) => {
    try {
      const products = await this.productService.getProducts();
      return res.json(products);
    } catch (error) {
      ErrorHandler.handleError(error, res, `Error in searchProducts: ${error.message}`);
    }
  };

 


}

module.exports = ProductController;
