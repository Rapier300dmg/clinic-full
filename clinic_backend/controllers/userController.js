const { User, Doctor, Appointment } = require('../models');

class UserController {
  async getAllUsers(req, res) {
    try {
      const users = await User.findAll({
        where: { role: ['patient', 'manager'] },
        attributes: ['id', 'firstName', 'lastName', 'email', 'role']
      });
      const doctors = await Doctor.findAll({
        attributes: ['id', 'doctorName', 'email', 'speciality', 'experience']
      });
      return res.json({ users, doctors });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async getMe(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: ['id','firstName','lastName','email','role','age']
      });
      if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
      return res.json(user);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async getUserById(req, res) {
    try {
      const user = await User.findByPk(req.params.id, {
        include: {
          model: Appointment,
          as: 'appointments'
        },
        attributes: ['id','firstName','lastName','email','role','age']
      });
      if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
      return res.json(user);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async updateUserById(req, res) {
    try {
      const { firstName, lastName, email, age } = req.body;
      if (req.user.role !== 'manager' && req.user.id !== +req.params.id) {
        return res.status(403).json({ error: 'Доступ запрещён' });
      }
      const [updated] = await User.update(
        { firstName, lastName, email, age },
        { where: { id: req.params.id } }
      );
      if (!updated) return res.status(404).json({ error: 'Пользователь не найден' });
      const user = await User.findByPk(req.params.id, {
        attributes: ['id','firstName','lastName','email','role','age']
      });
      return res.json(user);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async deleteUserById(req, res) {
    try {
      if (req.user.role !== 'manager') {
        return res.status(403).json({ error: 'Доступ запрещён' });
      }
      const deleted = await User.destroy({ where: { id: req.params.id } });
      if (!deleted) return res.status(404).json({ error: 'Пользователь не найден' });
      return res.json({ message: 'Пользователь удалён' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new UserController();
