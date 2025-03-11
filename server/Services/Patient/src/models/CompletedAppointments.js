const mongoose = require('mongoose');

const CompletedAppointmentSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  audioFilePath: {
    type: String
  },
  summary: {
    type: String
  },
  transcription: {
    type: String
  },
  details: {
    type: Map,  // Key-value pairs to store JSON-like data (symptoms, medicines, etc.)
    of: String
  },
  timeCompleted: {
    type: Date,
    default: Date.now
  },
  recordingStartedAt: {
    type: Date  // New field to track when recording started
  },
  pushedToEMRAt: {
    type: Date  // New field to track when doctor pushed data to EMR
  },
  emrSystem: {
    type: String  // EMR system or ID of the patient’s EMR system
  }
}, { timestamps: true });

module.exports = mongoose.model('CompletedAppointment', CompletedAppointmentSchema);
