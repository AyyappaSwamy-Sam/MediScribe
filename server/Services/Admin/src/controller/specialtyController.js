const Specialty = require('../models/Speciality'); // Assuming your Mongoose model is defined here

// Controller function to add a new specialty
exports.addSpecialty = async (req, res) => {
  try {
    console.log(req.body);
    const { name, description, conditions } = req.body;

    // Check if the specialty already exists
    const existingSpecialty = await Specialty.findOne({ name });
    if (existingSpecialty) {
      return res.status(400).json({ message: 'Specialty already exists' });
    }

    // Create a new specialty
    const newSpecialty = new Specialty({
      name,
      description,
      conditions
    });

    await newSpecialty.save();
    res.status(201).json({ message: 'Specialty added successfully', specialty: newSpecialty });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//localhost:5000/api/admin/delete-specialty/${id}

exports.deleteSpecialty = async (req, res) => {
  try {
    console.log(req.params);
    const id = req.params.id;
    const specialty = await Specialty.findById(id);
    if (!specialty) {
      return res.status(404).json({ message: 'Specialty not found' });
    }

    await Specialty.findByIdAndDelete(id);
    res.status(200).json({ message: 'Specialty deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};