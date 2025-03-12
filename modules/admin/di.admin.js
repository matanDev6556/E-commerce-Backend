const UserAdminController = require('./controllers/user.admin.controller');
const CategoryAdminController = require('./controllers/category.admin.controller');
const OrderAdminController = require('./controllers/order.admin.controller');
const ProductAdminController = require('./controllers/product.admin.controller');

const createAdminControllers = (userService, categoryService, orderService, productService) => {
  const userAdminController = new UserAdminController(userService);
  const categoryAdminController = new CategoryAdminController(categoryService);
  const orderAdminController = new OrderAdminController(orderService);
  const productAdminController = new ProductAdminController(productService);

  return {
    userAdminController,
    categoryAdminController,
    orderAdminController,
    productAdminController
  };
};

module.exports = {
  createAdminControllers
};