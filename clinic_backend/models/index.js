'use strict';
require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(
  process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS,
  { host: process.env.DB_HOST, port: process.env.DB_PORT||5432, dialect:'postgres', logging:false }
);

const User        = require('./user')(sequelize, DataTypes);
const Doctor      = require('./doctor')(sequelize, DataTypes);
const Appointment = require('./appointment')(sequelize, DataTypes);
const Review      = require('./review')(sequelize, DataTypes);

Doctor.hasMany(Appointment,    { foreignKey: 'doctorId' });
Appointment.belongsTo(Doctor,  { foreignKey: 'doctorId' });

User.hasMany(Appointment,      { foreignKey: 'patientId' });
Appointment.belongsTo(User,    { foreignKey: 'patientId', as: 'patient' });

Review.belongsTo(User,    { foreignKey: 'patientId', as: 'patient' });
User.hasMany(Review,      { foreignKey: 'patientId' });
Review.belongsTo(Doctor,  { foreignKey: 'doctorId' });
Doctor.hasMany(Review,    { foreignKey: 'doctorId' });

module.exports = { sequelize, Sequelize, User, Doctor, Appointment, Review };
