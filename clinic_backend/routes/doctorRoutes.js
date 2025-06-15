const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/doctorController');
const { verifyToken, requireManager, verifyTokenMiddleware } = require('../middleware/authMiddleware');
const { getRecommendedDoctors } = require('../controllers/doctorController');

router.get('/',        ctrl.getPublicList);
router.get('/all',     verifyToken, requireManager, ctrl.getAll);
router.get('/:id',     ctrl.getById);
router.post('/register', verifyToken, requireManager, ctrl.create);
router.delete('/:id', verifyToken, requireManager, ctrl.remove);
module.exports = router;
