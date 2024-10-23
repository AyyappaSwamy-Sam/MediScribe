const Appointment = require('../models/appointment');
const DoctorNotification = require('../models/doctorNotification');
const PatientNotification = require('../models/patientNotification');
const Doctor = require('../models/doctor')
const Patient = require('../models/patient');
const moment = require('moment');

exports.bookAppointment = async (req, res) => {
  try {
    console.log("hello", req.body)
    const { doctorId, patientId, date, timeSlot, description } = req.body;
    // if (!mongoose.Types.ObjectId.isValid(doctorId) || !mongoose.Types.ObjectId.isValid(patientId)) {
    //   return res.status(400).json({ error: 'Invalid doctor or patient ID.' });
    // }
    console.log(doctorId, patientId, date, timeSlot, description)
    // Check if the time slot is already booked
    // const appointmentExists = await Appointment.findOne({ date:date, timeSlot:timeSlot });
    const count = await Appointment.countDocuments();
    console.log(count);
    if (count > 0) {
      console.log('hi');
      const appointmentExists = await Appointment.findOne({ doctorId, date, timeSlot });
      console.log('Appointment already exists', appointmentExists)

    if (appointmentExists) {
      console.log(`Appointment1`)
      console.log('Appointment')
      return res.status(200).json({ message: 'This time slot is already booked.' });
      
    }

    
  }
    // Create new appointment
    const newAppointment = new Appointment({
      doctorId,
      patientId,
      date,
      timeSlot,
      description,
      status: 'scheduled'
    });
    await newAppointment.save();
    console.log("completed1");
    created_date = Date.now();
    console.log("completed2");
    const doctorNotification = new DoctorNotification({
      doctorId:doctorId,
      message: `New appointment scheduled on ${date} at ${timeSlot} description .`,
      BookedAt: created_date

    });
    console.log(doctorNotification);
    await doctorNotification.save();

    console.log("completed");

    // Create notification for patient
    const patientNotification = new PatientNotification({
      patientId,
      message: `Your appointment with doctor ${doctorId} is confirmed on ${date} at ${timeSlot}.`,
      BookedAt: created_date
    });
    await patientNotification.save();
    console.log()
    res.status(201).json({
      message: 'Appointment booked successfully!'
    });

    
    
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.getDoctorAvailability = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    // Get doctor details and available time slots for the given day
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    const availableSlots = doctor.availableTimeSlots.find(slot => slot.day === dayOfWeek);

    // Check booked slots on the same date
    const bookedAppointments = await Appointment.find({ doctorId, date });
    const bookedSlots = bookedAppointments.map(app => app.timeSlot);

    // Filter available slots
    const openSlots = availableSlots.slots.filter(slot => !bookedSlots.includes(slot));

    res.json({ availableSlots: openSlots });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



exports.getStats = async (req, res) => {
  try {
    // console.log(req)
    console.log(req.query)
    const { doctorId} = req.query;
    const today = moment().startOf('day');
    const endOfToday = moment().endOf('day');
    const startOfMonth = moment().startOf('month');

    const query = { doctorId };

    const totalAppointments = await Appointment.countDocuments(query);
    const todayAppointments = await Appointment.countDocuments({
      ...query,
      date: { $gte: today.toDate(), $lte: endOfToday.toDate() }
    });
    const thisMonthAppointments = await Appointment.countDocuments({
      ...query,
      date: { $gte: startOfMonth.toDate(), $lte: endOfToday.toDate() }
    });
    const completedAppointmentsToday = await Appointment.countDocuments({
      ...query,
      date: { $gte: today.toDate(), $lte: endOfToday.toDate() },
      status: 'completed'
    });
    const cancelledAppointmentsToday = await Appointment.countDocuments({
      ...query,
      date: { $gte: today.toDate(), $lte: endOfToday.toDate() },
      status: 'cancelled'
    });

    res.json({
      totalAppointments,
      todayAppointments,
      thisMonthAppointments,
      completedAppointmentsToday,
      cancelledAppointmentsToday
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};

exports.getRecentAppointments = async (req, res) => {
  try {
    // concole.log('hi',req.body)
    const { doctorId } = req.query;
    const appointments = await Appointment.find({ doctorId:doctorId })
      .sort({ date: -1, timeSlot: -1 })
      .limit(5)

    const formattedAppointments = await Promise.all(appointments.map(async (apt) => {
      const patient = await Patient.findById(apt.patientId);
      // console.log(patient)
      return {
        appointmentId:apt._id,
        patientName: patient.firstName + " "  + patient.lastName,
        patientId: patient._id,
        photo: patient.photourl,
        description: apt.description,
        time: apt.timeSlot,
        date: apt.date
      };
    }));

    res.json(formattedAppointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recent appointments', error: error.message });
  }
};

exports.getTodayAppointments = async (req, res) => {
  try {
    const { doctorId } = req.query;
    const today = moment().startOf('day');
    const endOfToday = moment().endOf('day');

    const appointments = await Appointment.find({
      doctorId,
      date: { $gte: today.toDate(), $lte: endOfToday.toDate() }
    })
      .sort({ date: 1, timeSlot: 1 })
      .populate('patientId', 'name');

    const formattedAppointments = await Promise.all(appointments.map(async (apt) => {
      const patient = await Patient.findById(apt.patientId);
      return {
        patientName: patient.name,
        photo: patient.photo,
        description: apt.description,
        time: apt.timeSlot,
        date: apt.date
      };
    }));

    res.json(formattedAppointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching today\'s appointments', error: error.message });
  }
};

exports.getNextAppointment = async (req, res) => {
  try {
    const { doctorId } = req.query;
    const now = moment();

    const nextAppointment = await Appointment.findOne({
      doctorId,
      date: { $gte: now.toDate() },
      status: 'scheduled'
    })
      .sort({ date: 1, timeSlot: 1 })
      .populate('patientId', 'name');

    if (!nextAppointment) {
      return res.json({ message: 'No upcoming appointments' });
    }

    const patient = await Patient.findById(nextAppointment.patientId);
    const formattedAppointment = {
      patientName: patient.name,
      photo: patient.photo,
      description: nextAppointment.description,
      time: nextAppointment.timeSlot,
      date: nextAppointment.date
    };

    res.json(formattedAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching next appointment', error: error.message });
  }
};

exports.getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { timeframe } = req.query;
    let startDate, endDate;

    switch (timeframe) {
      case 'today':
        startDate = moment().startOf('day');
        endDate = moment().endOf('day');
        break;
      case 'week':
        startDate = moment().startOf('week');
        endDate = moment().endOf('week');
        break;
      case 'month':
        startDate = moment().startOf('month');
        endDate = moment().endOf('month');
        break;
      case 'next-month':
        startDate = moment().add(1, 'month').startOf('month');
        endDate = moment().add(1, 'month').endOf('month');
        break;
      case 'all':
      default:
        startDate = moment(0); // Beginning of time
        endDate = moment().add(100, 'years'); // Far future
        break;
    }

    const appointments = await Appointment.find({
      doctorId,
      date: { $gte: startDate.toDate(), $lte: endDate.toDate() }
    }).populate('patientId', 'firstName lastName');

    const formattedAppointments = appointments.map(apt => ({
      _id: apt._id,
      patientName: `${apt.patientId.firstName} ${apt.patientId.lastName}`,
      date: apt.date,
      timeSlot: apt.timeSlot,
      description: apt.description,
      status: apt.status
    }));

    res.json(formattedAppointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
};