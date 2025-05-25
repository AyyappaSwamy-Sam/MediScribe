const express = require('express');
const {Login, SignUp} = require('../controller/AuthController');
const {validateLogin, validateSignup} = require('../middleware/AuthMiddleware');

const router = express.Router();

// Patient signup with validation middleware
router.post('/auth/signup', validateSignup, SignUp);

// Patient, Doctor, Admin - Signin with validation middleware
router.post('/auth/login', validateLogin, Login);


module.exports = router;