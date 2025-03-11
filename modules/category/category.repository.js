const mongoose = require('mongoose');
const { Category } = require('./category');

class CategoryRepository {
  #validateId(id) {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error('Invalid category ID', { cause: { status: 400 } });
    }
  }

  async getCategories() {
    try {
      return await Category.find();
    } catch (error) {
      throw new Error(`Failed to get categories: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      this.#validateId(id);
      return await Category.findById(id);
    } catch (error) {
      throw new Error(`Failed to find category by ID: ${error.message}`);
    }
  }

  async deleteById(id) {
    try {
      this.#validateId(id);
      return await Category.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Failed to delete category by ID: ${error.message}`);
    }
  }

  async addCategory(categoryData) {
    try {
      const category = new Category(categoryData);
      return await category.save();
    } catch (error) {
      throw new Error(`Failed to add category: ${error.message}`);
    }
  }

  async updateById(id, updateData) {
    try {
      this.#validateId(id);
      return await Category.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
      throw new Error(`Failed to update category by ID: ${error.message}`);
    }
  }
}

module.exports = CategoryRepository;
