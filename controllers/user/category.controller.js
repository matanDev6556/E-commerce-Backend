const ErrorHandler = require('../../helpers/handle_controllers_error');

class CategoryController {
  constructor(categoryService) {
    this.categoryService = categoryService;
  }

  getCategories = async (_, res) => {
    try {
      const categories = await this.categoryService.getCategories();
      return res.json(categories);
    } catch (error) {
      
      return ErrorHandler.handleError(error, res, 'Failed to fetch categories');
    }
  };

  getCategoryById = async (req, res) => {
    try {
      const category = await this.categoryService.getCategory(req.params.id);
      return res.json(category);
    } catch (error) {
      return ErrorHandler.handleError(error, res, 'Failed to get category');
    }
  };
}

module.exports = CategoryController;
