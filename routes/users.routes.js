const express = require('express');
const router = express.Router();

module.exports = (userController) => {
  router.get('/', userController.getUsers);
  router.get('/:id', userController.getUserById);
  router.put('/:id', userController.updateUser);

  return router;
};
