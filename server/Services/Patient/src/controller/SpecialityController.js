const Specialty = require('../models/Speciality');

exports.getAllSpecialties = async (req, res) => {
  try {
    const specialties = await Specialty.find();
    res.json(specialties);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching specialties', error: error.message });
  }
};