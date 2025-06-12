module.exports = (sequelize, DataTypes) =>
  sequelize.define('User', {
    id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    firstName:    { type: DataTypes.STRING,  allowNull: false },
    lastName:     { type: DataTypes.STRING,  allowNull: false },
    age:          { type: DataTypes.INTEGER, allowNull: false },
    email:        { type: DataTypes.STRING,  unique: true, allowNull: false },
    passwordHash: { type: DataTypes.STRING,  allowNull: false },
    role:         { 
      type: DataTypes.ENUM('patient','doctor','manager'),
      allowNull: false,
      defaultValue: 'patient'
    }
  }, {
    tableName:  'users',
    timestamps: true
  });
