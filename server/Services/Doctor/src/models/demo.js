// const mongoose = require('mongoose');

// // MongoDB connection
// const MONGO_URI = "mongodb+srv://subhash:12@cluster0.h1e1a.mongodb.net/MediScribe?retryWrites=true&w=majority&appName=Cluster0";
// mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.log(err));

// // Define the schema
// const appointmentRecordSchema = new mongoose.Schema({
//   appointmentId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Appointment',
//     required: true
//   },
//   patientId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Patient',
//     required: true
//   },
//   summary: {
//     type: String,
//     required: true
//   },
//   transcription: {
//     type: String,
//     required: true
//   },
//   structuredOutput: {
//     type: Map,
//     of: mongoose.Schema.Types.Mixed,
//     required: true
//   },
//   audioPath: {
//     type: String,
//     required: true
//   },
//   savedTime: {
//     type: String,
//     required: true
//   },
//   savedDate: {
//     type: Date,
//     default: Date.now
//   }
// }, { timestamps: true });

// const AppointmentRecord = mongoose.model('AppointmentRecord', appointmentRecordSchema);

// // Create dummy data
// const dummyData = new AppointmentRecord({
//   appointmentId: new mongoose.Types.ObjectId(),
//   patientId: new mongoose.Types.ObjectId(),
//   summary: "This is a summary of the appointment.",
//   transcription: "This is the transcription of the appointment.",
//   structuredOutput: { key1: "value1", key2: "value2" },
//   audioPath: "/path/to/audio/file",
//   savedTime: new Date().toLocaleTimeString(),
//   savedDate: new Date()
// });

// // Insert dummy data into the database
// dummyData.save()
//   .then(doc => {
//     console.log("Dummy data inserted:", doc);
//     mongoose.connection.close();
//   })
//   .catch(err => {
//     console.error("Error inserting dummy data:", err);
//     mongoose.connection.close();
//   });


const mongoose = require('mongoose');

// MongoDB connection
const MONGO_URI = "mongodb+srv://subhash:12@cluster0.h1e1a.mongodb.net/MediScribe?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define the schema
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

const AppointmentRecord = mongoose.model('AppointmentRecord', appointmentRecordSchema);

// Function to get records by patientId
const getRecordsByPatientId = async (patientId) => {
  try {
    const records = await AppointmentRecord.find({ patientId: patientId });
    console.log("Records found:", records);
  } catch (err) {
    console.error("Error retrieving records:", err);
  } finally {
    mongoose.connection.close();
  }
};

// Replace with the actual patientId you want to query
const patientId = "670ce8460abfd5a60f0fceda"; // Use the actual ObjectId string

// Call the function to get records by patientId
getRecordsByPatientId(patientId);