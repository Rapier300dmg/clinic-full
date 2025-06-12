const bcrypt = require('bcrypt');
const { Doctor } = require('../models');

exports.getPublicList = async (req, res, next) => {
  try {
    const list = await Doctor.findAll({
      attributes: ['id','doctorName','speciality','experience']
    });
    res.json(list);
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const list = await Doctor.findAll();
    res.json(list);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const doc = await Doctor.findByPk(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Врач не найден' });
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { doctorName, speciality, experience, email, password } = req.body;
    if (await Doctor.findOne({ where: { email } }))
      return res.status(409).json({ message: 'Email занят' });

    const hash = await bcrypt.hash(password, 10);
    const doc  = await Doctor.create({ doctorName, speciality, experience, email, passwordHash: hash });
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
};
