const mongoose = require('mongoose');

const appointmentRecordSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  transcription: {
    type: String,
    required: true
  },
  structuredOutput: {
    type: String,
    // of: mongoose.Schema.Types.Mixed,
    required: true
  },
  audioPath: {
    type: String,
    required: true
  },
  savedTime: {
    type: String,
    required: true
  },
  savedDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('AppointmentRecord', appointmentRecordSchema);
