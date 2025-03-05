class CategoryAdminController {
  constructor(categoryService) {
    this.categoryService = categoryService;
  }

  addCategory = async (req, res) => {
    try {
      const category = await this.categoryService.addCategory(
        req.body,
        req.files,
        req
      );
      return res.status(201).json({ success: true, data: category });
    } catch (error) {
      if (error.cause?.status) {
        return res
          .status(error.cause.status)
          .json({ success: false, message: error.message });
      }
      return res
        .status(500)
        .json({
          success: false,
          message: 'Failed to add category',
          error: error.message,
        });
    }
  };

  deleteCategory = async (req, res) => {
    try {
      const result = await this.categoryService.deleteCategory(req.params.id);
      res.json({ success: true, ...result });
    } catch (error) {
      if (error.cause?.status) {
        return res
          .status(error.cause.status)
          .json({ success: false, message: error.message });
      }
      return res.status(500).json({
        success: false,
        message: 'Failed to delete category',
        error: error.message,
      });
    }
  };

  editCategory = async (req, res) => {
    try {
      const { name, image, colour } = req.body;
      const category = await this.categoryService.editCategory(req.params.id, {
        name,
        image,
        colour,
      });
      return res.json(category);
    } catch (error) {
      if (error.cause?.status) {
        return res
          .status(error.cause.status)
          .json({ success: false, message: error.message });
      }
      return res.status(500).json({
        success: false,
        message: 'Failed to edit category',
        error: error.message,
      });
    }
  };
}

module.exports = CategoryAdminController;
