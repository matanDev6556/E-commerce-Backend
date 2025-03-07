const mongoose = require('mongoose');
const { Category } = require('../models/category');

class CategoryRepository {
  #validateId(id) {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error('Invalid category ID', { cause: { status: 400 } });
    }
  }
  async findById(id) {
    this.#validateId(id);
    return await Category.findById(id);
  }

  async deleteById(id) {
    this.#validateId(id);
    return await Category.findByIdAndDelete(id);
  }

  async addCategory(categoryData) {
    const category = new Category(categoryData);
    return await category.save();
  }

  async updateById(id, updateData) {
    this.#validateId(id);
    return await Category.findByIdAndUpdate(id, updateData, { new: true });
  }
}

module.exports = CategoryRepository;
