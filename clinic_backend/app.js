require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const bcrypt  = require('bcrypt');
const { sequelize, User } = require('./models');
const userRoutes = require('./routes/userRoutes');
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth',       require('./routes/authRoutes'));
app.use('/api/doctor',     require('./routes/doctorRoutes'));
app.use('/api/appointment',require('./routes/appointmentRoutes'));
app.use('/api/users', userRoutes);

async function seedManager() {
  const email = process.env.ADMIN_EMAIL;
  const pass  = process.env.ADMIN_PASS;
  if (!email || !pass) {
    console.warn('⚠️  Не задан ADMIN_EMAIL/ADMIN_PASS в .env, пропускаем сид менеджера');
    return;
  }

  const exists = await User.findOne({ where: { email } });
  if (!exists) {
    const hash = await bcrypt.hash(pass, 10);
    await User.create({
      firstName: 'Admin',
      lastName:  'User',
      age:        30,
      email,
      passwordHash: hash,
      role:      'manager'
    });
    console.log(`✅ Менеджер seeded: ${email}`);
  } else {
    console.log(`ℹ️  Менеджер уже есть: ${email}`);
  }
}

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
sequelize.authenticate()
  .then(() => sequelize.sync())
  .then(seedManager)
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server on ${PORT}`));
  })
  .catch(err => console.error('DB error:', err));
