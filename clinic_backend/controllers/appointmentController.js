// controllers/appointmentController.js
const { Appointment, User, Doctor } = require('../models');

const create = async (req, res, next) => {
  try {
    let { doctorId, patientId, time, reason } = req.body;
    if (req.user.role === 'patient') patientId = req.user.id;
    const apt = await Appointment.create({ doctorId, patientId, time, reason });
    res.status(201).json(apt);
  } catch (err) {
    next(err);
  }
};

const byDoctor = async (req, res, next) => {
  try {
    const list = await Appointment.findAll({
      where: { doctorId: req.params.doctorId },
      include: [
        { model: Doctor, attributes: ['doctorName', 'speciality', 'experience'] },
        { model: User,   as: 'patient', attributes: ['firstName', 'lastName'] }
      ],
      order: [['time', 'ASC']]
    });
    res.json(list);
  } catch (err) {
    next(err);
  }
};

const byPatient = async (req, res, next) => {
  try {
    const list = await Appointment.findAll({
      where: { patientId: req.params.patientId },
      include: [
        { model: Doctor, attributes: ['doctorName', 'speciality', 'experience'] }
      ],
      order: [['time', 'ASC']]
    });
    res.json(list);
  } catch (err) {
    next(err);
  }
};

const byId = async (req, res, next) => {
  try {
    const apt = await Appointment.findByPk(req.params.id, {
      include: [
        { model: Doctor, attributes: ['doctorName', 'speciality', 'experience'] },
        { model: User,   as: 'patient', attributes: ['firstName', 'lastName'] }
      ]
    });
    if (!apt) return res.status(404).json({ message: 'Запись не найдена' });
    res.json(apt);
  } catch (err) {
    next(err);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const apt = await Appointment.findByPk(req.params.id);
    if (!apt) return res.status(404).json({ message: 'Запись не найдена' });
    if (req.user.role !== 'doctor' || apt.doctorId !== req.user.id) {
      return res.status(403).json({ message: 'Нет доступа' });
    }
    apt.status = status;
    await apt.save();
    res.json(apt);
  } catch (err) {
    next(err);
  }
};

const uploadReport = async (req, res, next) => {
  try {
    const apt = await Appointment.findByPk(req.params.id);
    if (!apt) return res.status(404).json({ message: 'Запись не найдена' });
    if (req.user.role !== 'doctor' || apt.doctorId !== req.user.id) {
      return res.status(403).json({ message: 'Нет доступа' });
    }
    const { resultText } = req.body;
    apt.status     = 'accepted';
    apt.resultText = resultText;
    if (req.file)  apt.resultFile = req.file.filename;
    await apt.save();
    res.json(apt);
  } catch (err) {
    next(err);
  }
};

const rejectAppointment = async (req, res, next) => {
  try {
    const { rejectionReason } = req.body;
    const apt = await Appointment.findByPk(req.params.id);
    if (!apt) return res.status(404).json({ message: 'Запись не найдена' });
    if (req.user.role !== 'doctor' || apt.doctorId !== req.user.id) {
      return res.status(403).json({ message: 'Нет доступа' });
    }
    apt.status = 'declined';
    apt.rejectionReason = rejectionReason;
    await apt.save();
    res.json(apt);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const apt = await Appointment.findByPk(req.params.id);
    if (!apt) return res.status(404).json({ message: 'Запись не найдена' });
    await apt.destroy();
    res.json({ message: 'Запись удалена' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  create,
  byDoctor,
  byPatient,
  byId,
  updateStatus,
  uploadReport,
  rejectAppointment,
  remove
};
