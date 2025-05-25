const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const AppointmentRecord = require('../models/AppointmentRecord');
const Doctor = require('../models/Doctor');

// Controller to get patient details using appointmentId
exports.getPatientDetailsByAppointmentId = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    console.log(appointmentId)

    // Find the appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Get patient details using patientId from appointment
    const patient = await Patient.findById(appointment.patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    console.log(patient)
    return res.status(200).json({
      success: true,
      patient: {
        patientId : appointment.patientId,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        dob: patient.dob,
        phoneNumber: patient.phoneNumber,
        emrSystem: patient.emrSystem,
        gender: patient.gender,
        photourl: patient.photourl
      }
    });


  } catch (error) {
    console.error('Error in getPatientDetailsByAppointmentId:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};


exports.getStructuredOutputByAppointmentId = async (req, res) => {
    try {
      const { appointmentId } = req.params;


  
      // First find the appointment with doctor details populated
      const appointment = await Appointment.findById(appointmentId)

      
      
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      
      
      // Find all appointment records for this patient
      
      const appointmentRecords = await AppointmentRecord.find({ patientId: appointment.patientId })


     
  
      if (!appointmentRecords || appointmentRecords.length === 0) {
        return res.status(200).json({ message: 'No appointment records found for this patient' });
      }
      
      // Map through records to create a cleaner response
      const structuredOutputs = appointmentRecords.map(record => {
  
        return {
          structuredOutput: record.structuredOutput,
          summary: record.summary,
          date: record.savedDate, // Format: YYYY-MM-DD
          time: record.savedTime,
          appointmentId: record.appointmentId
        };
      });
      // Get doctor details using doctorId from appointment
      

      
      return res.status(200).json({
        success: true,
        totalRecords: appointmentRecords.length,
        records: structuredOutputs
      });
  
    } catch (error) {
      console.error('Error in getStructuredOutputByAppointmentId:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  };
