const express = require('express');
const { userController } = require('../../config/di');
const router = express.Router();

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);

module.exports = router;
