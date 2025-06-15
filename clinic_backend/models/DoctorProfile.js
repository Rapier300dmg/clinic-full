const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DoctorProfile = sequelize.define('DoctorProfile', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  specialityId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = DoctorProfile;
