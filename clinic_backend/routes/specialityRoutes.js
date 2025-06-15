const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/specialityController');
const { verifyTokenMiddleware, requireManager } = require('../middleware/authMiddleware');
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/',    verifyTokenMiddleware, requireManager, ctrl.create);
router.put('/:id',  verifyTokenMiddleware, requireManager, ctrl.update);
router.delete('/:id',verifyTokenMiddleware, requireManager, ctrl.remove);

module.exports = router;
