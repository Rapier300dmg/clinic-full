module.exports = (sequelize, DataTypes) =>
    sequelize.define('Appointment', {
      id:     { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      time:   { type: DataTypes.DATE,    allowNull: false },
      reason: { type: DataTypes.STRING,  allowNull: true }
    }, {
      tableName:  'appointments',
      timestamps: true
    });
  