

const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');


exports.appointmentList = async (req, res) => {
    try {
      const appointments = await Appointment.find()
        .populate('doctorId', 'firstName lastName')
        .populate('patientId', 'firstName lastName');
  
      const appointmentData = appointments.map(appointment => ({
        _id: appointment._id,
        doctorId: appointment.doctorId._id,
        doctorName: `Dr. ${appointment.doctorId.firstName} ${appointment.doctorId.lastName}`,
        patientId: appointment.patientId._id,
        patientName: `${appointment.patientId.firstName} ${appointment.patientId.lastName}`,
        date: appointment.date,
        timeSlot: appointment.timeSlot,
        description: appointment.description,
        status: appointment.status,
        booked: appointment.booked
      }));
  
      res.json(appointmentData);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching appointments' });
    }
  }


exports.getDoctorsBySpecialty = async (req, res) => {
    try {
      const id  = req.params.id;
      
      const doctors = await Doctor.find({ specialty: id });
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