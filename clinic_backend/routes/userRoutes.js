
const express = require('express');
const UserController = require('../controllers/userController');
const {
  verifyToken,
  requireManager
} = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/', verifyToken, requireManager, UserController.getAllUsers);
router.get('/me', verifyToken, UserController.getMe);
router.get('/:id', verifyToken, requireManager, UserController.getUserById);
router.put('/:id', verifyToken, UserController.updateUserById);
router.delete('/:id', verifyToken, requireManager, UserController.deleteUserById);

module.exports = router;
