const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/doctorController');
const { verifyToken, requireManager } = require('../middleware/authMiddleware');

router.get('/',        ctrl.getPublicList);
router.get('/all',     verifyToken, requireManager, ctrl.getAll);
router.get('/:id',     ctrl.getById);
router.post('/register', verifyToken, requireManager, ctrl.create);

module.exports = router;
