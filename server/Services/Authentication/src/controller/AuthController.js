const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Admin = require('../models/Admin');
const config = require('../config/Config');
const asyncHandler = require('express-async-handler'); // Simplifies async error handling


exports.SignUp = asyncHandler(async (req, res) => {
  try {
    const { email, password, firstName, lastName, dob, phoneNumber, emrSystem, gender } = req.body;
    
    if (!email || !password || !firstName || !lastName || !dob || !phoneNumber || !emrSystem || !gender) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingPatient = await Patient.findOne({ email });
    
    if (existingPatient) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const formattedDob = new Date(`${dob['year']}-${dob['month']}-${dob['day']}`);
    
    const newPatient = new Patient({
      email,
      password,
      firstName,
      lastName,
      dob: formattedDob,
      phoneNumber,
      emrSystem,
      gender
    });
    
   
   
    await newPatient.save().catch(error => {
    
      throw error;
    });

    const token = jwt.sign({ id: newPatient._id, userType: 'patient' }, config.JWT_SECRET, { expiresIn: '1d' });
    
    res.status(201).json({
      message: 'Patient account created successfully',
      token,
      userType: 'patient',
      patientID: newPatient._id
    });
    
  } catch (error) {
   
    res.status(500).json({ message: 'Error creating patient account', error: error.message });
  }
});


exports.Login = asyncHandler(async (req, res) => {
  const { email, password, userType } = req.body;
  
  if (!email || !password || !userType) {

    return res.status(400).json({ message: 'Email, password, and userType are required' });
  }

  let User;

  switch (userType) {
    case 'patient':
      User = Patient;
      break;
    case 'doctor':
      User = Doctor;
      break;
    case 'admin':
      User = Admin;
      break;
    default:
   
      return res.status(400).json({ message: 'Invalid user type' });
  }
  
  const user = await User.findOne({ email });
  
  try {
    if (!user) {
     
      return res.status(400).json({ message: 'Invalid email' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
    
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id, userType }, config.JWT_SECRET, { expiresIn: '1d' });
   

    res.json({ token, userType, patientID: user._id });
  } catch (error) {
   
    res.status(500).json({ message: 'Error signing in', error: error.message });
  }
});
