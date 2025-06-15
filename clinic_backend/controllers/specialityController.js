const { Speciality } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const list = await Speciality.findAll();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch specialities' });
  }
};

exports.getById = async (req, res) => {
  try {
    const spec = await Speciality.findByPk(req.params.id);
    if (!spec) return res.status(404).json({ message: 'Not found' });
    res.json(spec);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch speciality' });
  }
};

exports.create = async (req, res) => {
  try {
    const spec = await Speciality.create(req.body);
    res.status(201).json(spec);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create speciality' });
  }
};

exports.update = async (req, res) => {
  try {
    const spec = await Speciality.findByPk(req.params.id);
    if (!spec) return res.status(404).json({ message: 'Not found' });
    await spec.update(req.body);
    res.json(spec);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update speciality' });
  }
};

exports.remove = async (req, res) => {
  try {
    const spec = await Speciality.findByPk(req.params.id);
    if (!spec) return res.status(404).json({ message: 'Not found' });
    await spec.destroy();
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete speciality' });
  }
};
