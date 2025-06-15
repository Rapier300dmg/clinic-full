module.exports = (sequelize, DataTypes) =>
    sequelize.define('Doctor', {
      id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      doctorName:   { type: DataTypes.STRING,  allowNull: false },
      speciality:   { type: DataTypes.STRING,  allowNull: false },
      experience:   { type: DataTypes.INTEGER, allowNull: false },
      email:        { type: DataTypes.STRING,  unique: true, allowNull: false },
      passwordHash: { type: DataTypes.STRING,  allowNull: false }
    }, {
      tableName:  'doctors',
      timestamps: true
    });
  