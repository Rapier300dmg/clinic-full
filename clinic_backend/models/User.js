module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    firstName:    { type: DataTypes.STRING,  allowNull: false },
    lastName:     { type: DataTypes.STRING,  allowNull: false },
    age:          { type: DataTypes.INTEGER, allowNull: false },
    email:        { type: DataTypes.STRING,  unique: true, allowNull: false },
    passwordHash: { type: DataTypes.STRING,  allowNull: false },
    role: {
      type: DataTypes.ENUM('patient','doctor','manager'),
      allowNull: false,
      defaultValue: 'patient'
    }
  }, {
    tableName: 'users',
    timestamps: true
  });

  User.associate = (models) => {
    User.hasMany(models.Comment, {
      foreignKey: 'userId',
      as: 'comments',
      onDelete: 'CASCADE'
    });
    User.hasMany(models.Review, {
      foreignKey: 'patientId',
      as: 'reviews',
      onDelete: 'CASCADE'
    });
  };

  return User;
};
