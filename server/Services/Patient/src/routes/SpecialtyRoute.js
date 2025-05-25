const express = require('express');
const router = express.Router();
const specialtyController = require('../controller/SpecialityController');
const docterController = require('../controller/DoctorController');
const AuthenticateToken = require('../middleware/TokenValidator');

router.get('/specialties',  specialtyController.getAllSpecialties);
router.get('/specialty/:specialtyId',  docterController.getDoctorsBySpecialty);


module.exports = router;