const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');


exports.getAdminStats= async (req, res) => {
    try {
      const today = new Date();
      const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Get total patients count
      const totalPatients = await Patient.countDocuments();
      const newPatients = await Patient.countDocuments({
        createdAt: { $gte: lastWeek }
      });

      // Get appointments count
      const totalAppointments = await Appointment.countDocuments({
        date: { $gte: lastWeek }
      });

    //   // Calculate average feedback (assuming you store feedback in appointments)
    //   const completedAppointments = await Appointment.find({
    //     status: 'completed',
    //     date: { $gte: lastWeek }
    //   });

      // You would need to add a feedback field to your appointment schema
      const avgFeedback = 4.8; // Placeholder - implement actual calculation

      // Calculate percentage changes
      const previousWeekPatients = await Patient.countDocuments({
        createdAt: { 
          $gte: new Date(lastWeek.getTime() - 7 * 24 * 60 * 60 * 1000),
          $lt: lastWeek
        }
      });
      const previousWeekAppointments = await Appointment.countDocuments({
        date: { 
          $gte: new Date(lastWeek.getTime() - 7 * 24 * 60 * 60 * 1000),
          $lt: lastWeek
        }
      });

      // Calculate percentage changes with zero handling
    const calculatePercentageChange = (current, previous) => {
        if (previous === 0) {
        return current > 0 ? '100.0' : '0.0';
        }
        return ((current - previous) / previous * 100).toFixed(1);
    };
  
  const patientChange = calculatePercentageChange(newPatients, previousWeekPatients);
  const appointmentChange = calculatePercentageChange(totalAppointments, previousWeekAppointments);

      res.json([
        {
          title: 'Total Patients',
          value: totalPatients.toLocaleString(),
          subtitle: 'From last week',
          change: `${patientChange}%`,
          increasing: patientChange > 0,
          color: 'indigo'
        },
        {
          title: 'New Patients',
          value: newPatients.toString(),
          subtitle: 'From last week',
          change: `${patientChange}%`,
          increasing: patientChange > 0,
          color: 'emerald'
        },
        {
          title: 'Appointments',
          value: totalAppointments.toString(),
          subtitle: 'From last week',
          change: `${appointmentChange}%`,
          increasing: appointmentChange > 0,
          color: 'yellow'
        },
        {
          title: 'Patient Feedback',
          value: `${avgFeedback}/5`,
          subtitle: 'From last week',
          change: '+0.3',
          increasing: true,
          color: 'red'
        }
      ]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}




exports.getRecentAppointments = async (req, res) => {
    try {
        const now = new Date();

        // Fetch upcoming appointments
        const recentAppointments = await Appointment.find({
            status: 'scheduled',
            date: { $gte: now }
        })
        .sort({ date: 1, timeSlot: 1 })
        .limit(10)
        .populate({
            path: 'patientId',
            select: 'firstName lastName phoneNumber'
        })
        .lean();

        // Format appointments
        const formattedAppointments = recentAppointments.map(apt => ({
            name: `${apt.patientId.firstName} ${apt.patientId.lastName}`,
            phone: apt.patientId.phoneNumber,
            appointmentTime: apt.timeSlot,
            appointmentDate: new Date(apt.date).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short'
            }),
            status: apt.status
        }));

        res.status(200).json({ recentAppointments: formattedAppointments });

    } catch (error) {
        console.error('Error in getRecentAppointments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



exports.getYearlyAppointments = async (req, res) => {
    try {
        // Get current year's start and end dates
        const currentYear = new Date().getFullYear();
        const startOfYear = new Date(currentYear, 0, 1);
        const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999);

        // Aggregate appointments by month
        const monthlyAppointments = await Appointment.aggregate([
            {
                $match: {
                    date: {
                        $gte: startOfYear,
                        $lte: endOfYear
                    }
                }
            },
            {
                $group: {
                    _id: { $month: "$date" },
                    appointments: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            },
            {
                $project: {
                    _id: 0,
                    month: {
                        $let: {
                            vars: {
                                monthsInString: [
                                    'Jan', 'Feb', 'Mar', 'Apr',
                                    'May', 'Jun', 'Jul', 'Aug',
                                    'Sep', 'Oct', 'Nov', 'Dec'
                                ]
                            },
                            in: {
                                $arrayElemAt: ['$$monthsInString', { $subtract: ['$_id', 1] }]
                            }
                        }
                    },
                    appointments: 1
                }
            }
        ]);

        // Fill in missing months with zero appointments
        const allMonths = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        const completeMonthlyData = allMonths.map(month => {
            const foundMonth = monthlyAppointments.find(m => m.month === month);
            return foundMonth || { month, appointments: 0 };
        });

        res.status(200).json(completeMonthlyData);

    } catch (error) {
        console.error('Error in getYearlyAppointments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};




exports.getAvailableDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find({ available: true })
            
            .select('firstName lastName phoneNumber available specialization')
            .lean();

        const formattedDoctors = doctors.map(doctor => ({
            name: `Dr. ${doctor.firstName} ${doctor.lastName}`,
            phone: doctor.phoneNumber,
            status: doctor.available ? "Available" : "Unavailable",
            specialty: doctor.specialization
        }));

        res.status(200).json(formattedDoctors);

    } catch (error) {
        console.error('Error in getAvailableDoctors:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};