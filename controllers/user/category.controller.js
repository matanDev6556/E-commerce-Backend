class CategoryController {
  constructor(categoryService) {
    this.categoryService = categoryService;
  }

  getCategories = async (_, res) => {
    try {
      const categories = await this.categoryService.getCategories();
      return res.json(categories);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Failed to fetch categories', error: error.message });
    }
  };

  getCategoryById = async (req, res) => {
    try {
      const category = await this.categoryService.getCategory(req.params.id);
      return res.json(category);
    } catch (error) {
      console.error('Error get category: ', error);
      if (error.cause?.status) {
        return res
          .status(error.cause.status)
          .json({ success: false, message: error.message });
      }
      return res.status(500).json({ message: 'Error get category' });
    }
  };
}

module.exports = CategoryController;
