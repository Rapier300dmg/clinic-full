module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    comment: {
      type: DataTypes.TEXT,
    },
    appointmentId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Review.associate = models => {
    Review.belongsTo(models.Appointment, { foreignKey: 'appointmentId' });
    Review.belongsTo(models.Doctor, { foreignKey: 'doctorId' });
    Review.belongsTo(models.User, {
      foreignKey: 'patientId',
      as: 'patient'
    });
    Review.hasMany(models.Comment, {
      foreignKey: 'reviewId',
      as: 'comments',
      onDelete: 'CASCADE'
    });
  };

  return Review;
};
