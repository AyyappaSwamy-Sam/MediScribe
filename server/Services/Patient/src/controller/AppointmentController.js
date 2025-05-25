const Appointment = require('../models/Appointment');
// const DoctorNotification = require('../models/doctorNotification');
// const PatientNotification = require('../models/patientNotification');
// const Doctor = require('../models/Doctor')


exports.bookAppointment = async (req, res) => {
  try {
    
    const { doctorId, patientId, date, timeSlot, description } = req.body;
    // if (!mongoose.Types.ObjectId.isValid(doctorId) || !mongoose.Types.ObjectId.isValid(patientId)) {
    //   return res.status(400).json({ error: 'Invalid doctor or patient ID.' });
    // }
    
    // Check if the time slot is already booked
    // const appointmentExists = await Appointment.findOne({ date:date, timeSlot:timeSlot });
    const count = await Appointment.countDocuments();
    
    if (count > 0) {
      
      const appointmentExists = await Appointment.findOne({ doctorId, date, timeSlot });
      
    if (appointmentExists) {
     
      return res.status(200).json({ message: 'This time slot is already booked.' });
      
    }

    
  }
    // Create new appointment
    const newAppointment = new Appointment({
      doctorId,
      patientId,
      date,
      timeSlot,
      description,
      status: 'scheduled'
    });
    await newAppointment.save();
    
    created_date = Date.now();
    
    // const doctorNotification = new DoctorNotification({
    //   doctorId:doctorId,
    //   message: `New appointment scheduled on ${date} at ${timeSlot} description .`,
    //   BookedAt: created_date

    // });
    
    // await doctorNotification.save();

    

    // // Create notification for patient
    // const patientNotification = new PatientNotification({
    //   patientId,
    //   message: `Your appointment with doctor ${doctorId} is confirmed on ${date} at ${timeSlot}.`,
    //   BookedAt: created_date
    // });
    // await patientNotification.save();
    
    res.status(201).json({
      message: 'Appointment booked successfully!'
    });

    
    
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


