const express = require('express');
const AuthenticateToken = require('../middleware/TokenValidator');
const DashBoardController = require('../controller/DashBoardController');
const doctorController = require('../controller/doctorController');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const dropboxRoutes = require('../controller/DropBoxController');
const specialtyController = require('../controller/specialtyController');
const appointmentController = require('../controller/appointmentController');


// Configure multer for file upload

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  const upload = multer({ storage });

// router.get('/stats', AuthenticateToken, DashBoardController.getAdminStats);
// router.get('/recent-patients', AuthenticateToken,  DashBoardController.getRecentAppointments);
// router.get('/appointments-timeline', AuthenticateToken, DashBoardController.getYearlyAppointments);
// router.get('/doctors-list',AuthenticateToken, DashBoardController.getAvailableDoctors);







// Routes
router.post('/add-doctor',upload.single('photo'), doctorController.addDoctor);
router.get('/specialties',doctorController.getSpecialties);
router.get('/doctors-list',doctorController.doctorList);
router.post('/add-specialty',specialtyController.addSpecialty);
router.delete('/delete-specialty/:id', specialtyController.deleteSpecialty);
router.get('/appointment-list', appointmentController.appointmentList);
router.get('/doctors/specialty/:id', appointmentController.getDoctorsBySpecialty);
// router.use('/dropbox/upload', dropboxRoutes.uploadToDropbox);

module.exports = router;