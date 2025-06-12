require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host:    process.env.DB_HOST,
    port:    process.env.DB_PORT,
    dialect: 'postgres',
    logging: false
  }
);

const User        = require('./user')(sequelize, DataTypes);
const Doctor      = require('./doctor')(sequelize, DataTypes);
const Appointment = require('./appointment')(sequelize, DataTypes);

// Ассоциации
Doctor.hasMany(Appointment,   { foreignKey: 'doctorId' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctorId' });

User.hasMany(Appointment,     { foreignKey: 'patientId' });
Appointment.belongsTo(User,   { foreignKey: 'patientId', as: 'patient' });

module.exports = { sequelize, User, Doctor, Appointment };
