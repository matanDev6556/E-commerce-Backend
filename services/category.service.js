const { deleteImages } = require('../helpers/media_helper');

class CategoryService {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async getCategories(){
    return await this.categoryRepository.getCategories();
  }

  async addCategory(categoryData, files, req) {
    // Check if the image was uploaded
    const image = files['image']?.[0];
    if (!image) {
      throw new Error('No file found!', { cause: { status: 400 } });
    }

    // Create URL for the image using req
    const imageUrl = `${req.protocol}://${req.get('host')}/${image.path}`;
    const finalCategoryData = { ...categoryData, image: imageUrl };

    // Create a new category in the DB through the Repository
    const category = await this.categoryRepository.addCategory(
      finalCategoryData
    );
    return category;
  }

  async deleteCategory(categoryId) {
    // Check if the category exists
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new Error('Category not found', { cause: { status: 404 } });
    }

    if (category.image) {
      await deleteImages([category.image]);
    }

    // Mark the category for deletion (soft delete)
    await this.categoryRepository.updateById(categoryId, {
      markedForDeletion: true,
    });

    return { message: 'Category marked for deletion or deleted successfully' };
  }

  async editCategory(categoryId, categotyData) {
    const category = await this.categoryRepository.updateById(
      categoryId,
      categotyData
    );
    if (!category)
      throw new Error('Category not found', { cause: { status: 404 } });
    return category;
  }
}

module.exports = CategoryService;
