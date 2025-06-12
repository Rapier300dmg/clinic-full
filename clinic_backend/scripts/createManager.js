require('dotenv').config();
const sequelize = require('../config/database');
const { User } = require('../models');
const { hashPassword } = require('../utils/hash');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Соединение с базой установлено ✅');

    const email = 'manager@clinic.com';
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      console.log('Менеджер уже существует');
      process.exit(0);
    }

    const hashedPassword = await hashPassword('manager123');
    const manager = await User.create({
      firstName: 'Admin',
      lastName: 'Manager',
      email,
      password: hashedPassword,
      role: 'manager'
    });

    console.log('Менеджер создан успешно ✅');
    process.exit(0);
  } catch (err) {
    console.error('Ошибка создания менеджера:', err);
    process.exit(1);
  }
})();