const Doctor = require('../models/Doctor');
const mongoose = require('mongoose');

exports.getDoctorById = async (req, res) => {
  const doctorId = req.params.id;

  if (!doctorId) {
    return res.status(400).json({ message: 'Doctor ID is required' });
  }

  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    return res.status(400).json({ message: 'Invalid doctor ID format' });
  }

  try {
    const doctor = await Doctor.findById(doctorId)
      .select('-password')
      .populate('specialty', 'name');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({
      _id: doctor._id,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      email: doctor.email,
      specialization: doctor.specialization,
      specialty: doctor.specialty,
      experience: doctor.experience,
      available: doctor.available,
      photoPath: doctor.photoPath,
      availableTimeSlots: doctor.availableTimeSlots,
      description: doctor.description,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getDoctorsBySpecialty = async (req, res) => {
  try {
    const { specialtyId } = req.params;
    
    const doctors = await Doctor.find({ specialty: specialtyId });
    const formattedDoctors = doctors.map(({ 
      _id, firstName, lastName, specialty, experience, available, 
      photoPath, licenseNumber, availableTimeSlots, email , description,
    }) => ({
      _id,
      user: { firstName, lastName },
      specialty,
      experience,
      available,
      photoPath, // Assuming photoUrl is now photoPath
      licenseNumber,
      availableDays: availableTimeSlots.map(slot => slot.day), // Extracting available days
      email,
      description
    }));

    res.json(formattedDoctors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors', error: error.message });
  }
};