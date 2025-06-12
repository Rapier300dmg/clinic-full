// controllers/appointmentController.js
const { Appointment, User, Doctor } = require('../models');

exports.create = async (req, res, next) => {
  try {
    let { doctorId, patientId, time, reason } = req.body;
    if (req.user.role === 'patient') {
      patientId = req.user.id;
    }
    const apt = await Appointment.create({ doctorId, patientId, time, reason });
    res.status(201).json(apt);
  } catch (err) {
    next(err);
  }
};

exports.byDoctor = async (req, res, next) => {
  try {
    const list = await Appointment.findAll({
      where: { doctorId: req.params.doctorId },
      include: [
        {
          model: Doctor,
          attributes: ['doctorName', 'speciality', 'experience'],
        },
        {
          model: User,
          as: 'patient',
          attributes: ['firstName', 'lastName'],
        }
      ],
      order: [['time', 'ASC']]
    });
    res.json(list);
  } catch (err) {
    next(err);
  }
};

exports.byPatient = async (req, res, next) => {
  try {
    const list = await Appointment.findAll({
      where: { patientId: req.params.patientId },
      include: [
        {
          model: Doctor,
          attributes: ['doctorName', 'speciality', 'experience'],
        },
        {
          model: User,
          as: 'patient',
          attributes: ['firstName', 'lastName'],
        }
      ],
      order: [['time', 'ASC']]
    });
    res.json(list);
  } catch (err) {
    next(err);
  }
};

exports.byId = async (req, res, next) => {
  try {
    const apt = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: Doctor,
          attributes: ['doctorName', 'speciality', 'experience'],
        },
        {
          model: User,
          as: 'patient',
          attributes: ['firstName', 'lastName'],
        }
      ]
    });
    if (!apt) return res.status(404).json({ message: 'Запись не найдена' });
    res.json(apt);
  } catch (err) {
    next(err);
  }
};
