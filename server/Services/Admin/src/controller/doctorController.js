const Doctor = require('../models/Doctor');
const Specialty = require('../models/Speciality');
// const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const config = require('../config/Config');

const { Dropbox } = require('dropbox');




exports.addDoctor = async (req, res) => {
  try {
    console.log('nfkdj')
    console.log(req.body);
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      licenseNumber,
      description,
      specialty,
      experience,
      education,
      gender,
      availableDays,
      availableTimeSlots,
    } = req.body;
   
    const availableDaysList = availableDays.split(',');
    const availableTimeSlotsList = availableTimeSlots.split(',');

    console.log(firstName, lastName, email, password, phoneNumber, licenseNumber)
    
    // Configure Dropbox
    // const dbx = new Dropbox({ accessToken: config.dropboxAccessToken });


    const specialtyDoc = await Specialty.findById(specialty);
    
    // console.log(specialtyDoc.name, Specialty);
    //photo
    // let photoFileName = null;
    // if (req.file) {
    //   const { originalname, buffer } = req.file;
    //   const response = await dbx.filesUpload({
    //     contents: buffer,
    //     path: `/doctors/${originalname}`,
    //     mode: { '.tag': 'add' },
    //   });
    //   photoFileName = response.name;
    // }

    // Parse time slots
    
    const formattedTimeSlots = [{
      day: availableDaysList,
      slots: availableTimeSlotsList
    }];

    const newDoctor = new Doctor({
      firstName:firstName,
      lastName:lastName,
      email:email,
      password: password,
      phoneNumber:phoneNumber,
      licenseNumber:licenseNumber,
      specialty: specialty,
      specialization:specialtyDoc.name,
      experience: parseInt(experience),
      education:education,
      description:description,
      gender:gender,
      availableTimeSlots: formattedTimeSlots,
      available: true,
      photoPath: req.file ? req.file.filename : null
    });

    await newDoctor.save();

    res.status(201).json({
      success: true,
      message: 'Doctor added successfully',
      data: newDoctor
    });
  } catch (error) {
    console.error('Error adding doctor:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding doctor',
      error: error.message
    });
  }
};

exports.getSpecialties = async (req, res) => {
  try {
    console.log('hihi');
    const specialties = await Specialty.find();
    res.status(200).json(specialties);
  } catch (error) {
    console.error('Error fetching specialties:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching specialties',
      error: error.message
    });
  }
};


exports.doctorList = async(req, res)=>{

  try {
    const doctors = await Doctor.find();
    const formattedDoctors = doctors.map(doctor => ({
      id:doctor._id,
      specality: doctor.specialization,
      avatar : doctor.photoPath,
      name: `Dr. ${doctor.firstName} ${doctor.lastName}`,
      email: doctor.email,
      phoneNumber: doctor.phoneNumber,
      available: doctor.available
    }));
    res.status(200).json(formattedDoctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctors',
      error: error.message
    });
  }
}

