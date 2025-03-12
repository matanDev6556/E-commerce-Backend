const express = require('express');
const router = express.Router();

module.exports = (userAdminController) => {
  // users
  router.get('/count', userAdminController.getUserCount);
  router.delete('/:id', userAdminController.deleteUser);

  return router;
}