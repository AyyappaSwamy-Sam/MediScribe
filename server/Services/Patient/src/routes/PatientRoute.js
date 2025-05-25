const express = require('express');
const router = express.Router();
const PatientController = require('../controller/PatientController');
const AuthenticateToken = require('../middleware/TokenValidator');

router.get('/my-profile/:id',  PatientController.getPatientDetails);
router.get('/medicalHistory/:id',  PatientController.getPatientMedicalHistory);
router.get('/medical-history/details/:id',  PatientController.getCompletedAppointmentDetails)

module.exports = router;