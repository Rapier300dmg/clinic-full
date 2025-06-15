const { Review, Doctor, User, Appointment } = require('../models');

exports.create = async (req, res, next) => {
  try {
    const { rating, comment, appointmentId } = req.body;
    const patientId = req.user.id;
    const apt = await Appointment.findByPk(appointmentId);
    if (!apt || apt.status !== 'accepted') {
      return res.status(400).json({ message: 'Можно оставить отзыв только после завершённого приёма.' });
    }
    const exists = await Review.findOne({ where: { appointmentId, patientId } });
    if (exists) {
      return res.status(400).json({ message: 'Вы уже оставили отзыв для этой записи.' });
    }
    const review = await Review.create({ rating, comment, appointmentId, doctorId: apt.doctorId, patientId });
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

exports.getDoctorReviews = async (req, res, next) => {
  try {
    const doctorId = req.params.doctorId;
    const reviews = await Review.findAll({
      where: { doctorId },
      include: [{ model: User, as: 'patient', attributes: ['firstName','lastName'] }],
      order: [['createdAt','DESC']]
    });
    const avg = reviews.length
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;
    res.json({ averageRating: avg.toFixed(1), total: reviews.length, reviews });
  } catch (err) {
    next(err);
  }
};

exports.getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      include: [
        { model: User,   as: 'patient', attributes: ['firstName','lastName'] },
        { model: Doctor, attributes: ['doctorName'] }
      ],
      order: [['createdAt','DESC']]
    });
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const rv = await Review.findByPk(reviewId);
    if (!rv) return res.status(404).json({ message: 'Отзыв не найден' });
    await rv.destroy();
    res.json({ message: 'Отзыв удалён' });
  } catch (err) {
    next(err);
  }
};
