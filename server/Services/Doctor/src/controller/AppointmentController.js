const Appointment = require('../models/Appointment');
// const DoctorNotification = require('../models/doctorNotification');
// const PatientNotification = require('../models/patientNotification');
const Doctor = require('../models/Doctor')
const Patient = require('../models/Patient');
const moment = require('moment');


exports.getStats = async (req, res) => {
  try {
    
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
    const appointments = await Appointment.find({ doctorId:doctorId, status:'scheduled' })
      .sort({ date: -1, timeSlot: -1 })
      .limit(4)

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
        date: apt.date,
        status: apt.status
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
        date: apt.date,
        status: apt.status
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

exports.updateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { reason } = req.body;
    console.log(req.body)

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(200).json({ message: 'Appointment not found' });
    }

    appointment.status = 'cancelled';
    appointment.description = appointment.description+ "\n Reason For cancellation: "+reason; // Using the description field to store the cancellation reason
    appointment.booked = false;

    await appointment.save();

    res.status(200).json({ message: 'Appointment cancelled successfully', appointment });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};