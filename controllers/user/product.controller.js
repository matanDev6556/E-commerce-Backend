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
      this.handleError(error, res, `Error in getProducts: ${error.message}`);
    }
  };

  getProductById = async (req, res) => {
    try {
      const product = await this.productService.getProductById(req.params.id);
      return res.json(product);
    } catch (error) {
      this.handleError(error, res, `Error in getProductById: ${error.message}`);
    }
  };

  searchProducts = async (_, res) => {
    try {
      const products = await this.productService.getProducts();
      return res.json(products);
    } catch (error) {
      this.handleError(error, res, `Error in searchProducts: ${error.message}`);
    }
  };

 

  handleError(error, res,msg) {
    console.error('Error in controller:', error);
    const status = error.cause?.status || 500;
    const message = msg;
    const errorDetails = error.message;
    
    return res.status(status).json({
      success: false,
      message,
      errorDetails,
    });
  }
}

module.exports = ProductController;
