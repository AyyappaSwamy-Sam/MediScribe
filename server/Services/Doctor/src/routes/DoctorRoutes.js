const express = require('express');
const router = express.Router();
const appointmentController = require('../controller/AppointmentController');
const doctorController = require('../controller/DoctorController');
const AuthenticateToken = require('../middleware/TokenValidator');
const AppointmentRecordController = require('../controller/AppointmentRecordController')

router.get('/dashboard/stats',  appointmentController.getStats);
router.get('/doctor/recent',  appointmentController.getRecentAppointments);
router.get('/doctor/todayappointments',  appointmentController.getTodayAppointments);
router.get('/doctor/next',  appointmentController.getNextAppointment);
router.get('/doctor/:doctorId',  appointmentController.getDoctorAppointments);
router.get('/doctors/my-profile/:doctorId',  doctorController.getDoctorById);
router.post('/doctor/UpdateData/:appointmentId',  appointmentController.updateAppointment);

router.get('/doctor/patientDetails/:appointmentId', AppointmentRecordController.getPatientDetailsByAppointmentId);
router.get('/doctor/patientInfo/:appointmentId', AppointmentRecordController.getStructuredOutputByAppointmentId);

module.exports = router;