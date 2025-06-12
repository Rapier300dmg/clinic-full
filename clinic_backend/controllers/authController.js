const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const { User, Doctor } = require('../models');

exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, age, email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email и пароль обязательны' });

    if (await User.findOne({ where: { email } }))
      return res.status(409).json({ message: 'Email занят' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName, lastName, age,
      email, passwordHash: hash,
      role: 'patient'
    });

    res.status(201).json({
      id: user.id,
      firstName: user.firstName,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let entity = await User.findOne({ where: { email } });
    let role   = entity?.role;

    if (!entity) {
      entity = await Doctor.findOne({ where: { email } });
      if (entity) role = 'doctor';
    }

    if (!entity)
      return res.status(401).json({ message: 'Неверные учётные данные' });

    const match = await bcrypt.compare(password, entity.passwordHash);
    if (!match)
      return res.status(401).json({ message: 'Неверные учётные данные' });

    const token = jwt.sign(
      { id: entity.id, role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({ token, role });
  } catch (err) {
    next(err);
  }
};
