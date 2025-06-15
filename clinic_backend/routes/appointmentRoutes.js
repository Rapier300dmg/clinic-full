const express = require('express');
const multer  = require('multer');
const path    = require('path');
const {
  verifyToken,
  requireDoctor,
  requirePatient,
  requireManager,
  
} = require('../middleware/authMiddleware');

const ctrl   = require('../controllers/appointmentController');
const router = express.Router();
const fileCtrl = require('../controllers/fileController');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'text/plain'
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Недопустимый формат. Можно PDF, JPG/PNG или TXT.'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});
router.post('/create', verifyToken, requirePatient, ctrl.create);
router.get('/patient/:patientId', verifyToken, requirePatient, ctrl.byPatient);
router.get('/doctor/:doctorId', verifyToken, requireDoctor, ctrl.byDoctor);
router.get('/:id', verifyToken, ctrl.byId);
router.patch('/:id/status', verifyToken, requireDoctor, ctrl.updateStatus);
router.delete('/:id', verifyToken, requireManager, ctrl.remove);
router.patch('/:id/reject', verifyToken, requireDoctor, ctrl.rejectAppointment);
router.post('/:id/report', verifyToken, requireDoctor, upload.single('file'), ctrl.uploadReport);
router.post('/accept/:id', verifyToken, requireDoctor, fileCtrl.create);
router.post('/decline/:id', verifyToken, requireDoctor, ctrl.updateStatus);
module.exports = router;
