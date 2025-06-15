require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const bcrypt  = require('bcrypt');
const path    = require('path');
const { sequelize, User } = require('./models');

const userRoutes        = require('./routes/userRoutes');
const authRoutes        = require('./routes/authRoutes');
const doctorRoutes      = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/auth',        authRoutes);
app.use('/api/doctor',      doctorRoutes);
app.use('/api/appointment', appointmentRoutes);
app.use('/api/users',       userRoutes);
async function seedManager() {
  const email = process.env.ADMIN_EMAIL;
  const pass  = process.env.ADMIN_PASS;
  if (!email || !pass) {
    console.warn('⚠️  ADMIN_EMAIL/ADMIN_PASS не заданы, пропускаем сид менеджера');
    return;
  }
  const exists = await User.findOne({ where: { email } });
  if (!exists) {
    const hash = await bcrypt.hash(pass, 10);
    await User.create({
      firstName:   'Admin',
      lastName:    'User',
      age:           30,
      email,
      passwordHash: hash,
      role:        'manager'
    });
  } else {
  }
}

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.message.startsWith('Недопустимый') ? 400 : (err.status || 500);
  res.status(status).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
sequelize.authenticate()
  .then(() => sequelize.sync({ alter: true }))
  .then(seedManager)
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server on ${PORT}`));
  })
  .catch(err => console.error('DB error:', err));
