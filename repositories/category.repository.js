const { Category } = require('../models/category');

class CategoryRepository {
  async findById(id) {
    return await Category.findById(id);
  }

  async deleteById(id) {
    return await Category.findByIdAndDelete(id);
  }

  async addCategory(categoryData) {
    const category = new Category(categoryData);
    return await category.save();
  }

  async updateById(id, updateData) {
    return await Category.findByIdAndUpdate(id, updateData, { new: true });
  }
}

module.exports = CategoryRepository;
