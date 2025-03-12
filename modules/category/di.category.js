const CategoryRepository = require('./category.repository');
const CategoryService = require('./category.service');
const CategoryController = require('./category.controller');

const categoryRepository = new CategoryRepository();
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);


module.exports = {
  categoryRepository,
  categoryService,
  categoryController,

};