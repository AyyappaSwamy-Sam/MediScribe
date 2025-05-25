const express = require('express');
const { bookAppointment } = require('../controller/AppointmentController');
const Doctor = require('../controller/DoctorController')
const AuthenticateToken = require('../middleware/TokenValidator');

const router = express.Router();

router.get('/:id', Doctor.getDoctorById);

router.post('/book',  bookAppointment);


module.exports = router;
