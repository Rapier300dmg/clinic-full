const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Speciality = sequelize.define('Speciality', {
  speciality: {
    type: DataTypes.STRING,
    allowNull: false
  },
  experience: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Speciality;
