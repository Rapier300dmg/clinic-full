const express = require('express');
const router  = express.Router();
const reviewCtrl = require('../controllers/reviewController');
const { verifyToken, requirePatient, requireManager } = require('../middleware/authMiddleware');

router.post('/', verifyToken, requirePatient, reviewCtrl.create);

router.get('/', reviewCtrl.getAllReviews);

router.get('/:doctorId', reviewCtrl.getDoctorReviews);

router.delete('/:reviewId', verifyToken, requireManager, reviewCtrl.remove);

module.exports = router;
