const Doctor = require('../models/Doctor');


exports.getDoctorById = async (req, res) => {
  try {
    console.log(req.params)
    const { doctorId } = req.params;
    const doctor = await Doctor.findById(doctorId);
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const formattedDoctor = {
      _id: doctor._id,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      specialization: doctor.specialization,
      licenseNumber: doctor.licenseNumber,
      experience: doctor.experience,
      available: doctor.available,
      photoPath: doctor.photoPath,
      description: doctor.description,
      education: doctor.education,
      email: doctor.email,
      availableTimeSlots: doctor.availableTimeSlots
    };

    res.json(formattedDoctor);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctor', error: error.message });
  }
};