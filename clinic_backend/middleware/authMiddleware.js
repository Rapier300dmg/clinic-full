const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) 
    return res.status(401).json({ message: 'Токен не передан' });

  const token = auth.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Неверный токен' });
  }
};

exports.requireManager = (req, res, next) => {
  if (req.user.role !== 'manager')
    return res.status(403).json({ message: 'Только менеджер' });
  next();
};

exports.requirePatient = (req, res, next) => {
  if (req.user.role !== 'patient')
    return res.status(403).json({ message: 'Только пациент' });
  next();
};

exports.requireDoctor = (req, res, next) => {
  if (req.user.role !== 'doctor')
    return res.status(403).json({ message: 'Только врач' });
  next();
};
