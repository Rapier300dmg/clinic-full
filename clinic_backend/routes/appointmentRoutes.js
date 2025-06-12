const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/appointmentController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/create',             verifyToken, ctrl.create);
router.get('/doctor/:doctorId',    verifyToken, ctrl.byDoctor);
router.get('/patient/:patientId',  verifyToken, ctrl.byPatient);
router.get('/:id',                 verifyToken, ctrl.byId);

module.exports = router;
