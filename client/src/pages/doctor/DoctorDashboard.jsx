
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Clock, User, FileText, Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    thisMonthAppointments: 0,
    completedAppointmentsToday: 0,
    cancelledAppointmentsToday: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [nextAppointment, setNextAppointment] = useState(null);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  const doctorId = localStorage.getItem('id1');
  useEffect(() => {
    const fetchData = async () => {
      try {
     
        const [statsRes, recentRes, nextRes, todayRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/dashboard/stats?doctorId=${doctorId}`),
          axios.get(`http://localhost:5000/api/doctor/recent?doctorId=${doctorId}`),
          axios.get(`http://localhost:5000/api/doctor/next?doctorId=${doctorId}`),
          axios.get(`http://localhost:5000/api/doctor/todayappointments?doctorId=${doctorId}`)
        ]);

        setStats(statsRes.data || {});
        setRecentAppointments(Array.isArray(recentRes.data) ? recentRes.data : []);
        setNextAppointment(nextRes.data?.message === "No upcoming appointments" ? null : nextRes.data);
        setTodayAppointments(Array.isArray(todayRes.data) ? todayRes.data : []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } 
    };

    fetchData();
    
    // const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    // return () => clearInterval(timer);
  }, [doctorId]);

  const handleStartAppointment = (appointmentId) => {
    if (appointmentId) {
      navigate(`/doctor-page/appointments/${appointmentId}`);
    }
  };

  const handleCancelAppointment = async (appointmentId, reason) => {
    try {
      console.log(reason);
      await axios.post(`http://localhost:5000/api/doctor/UpdateData/${appointmentId}`, { reason });
      // After successful cancellation, you might want to refresh the appointments list
      // This could be done by calling the fetchData function again or updating the state directly
      console.log('Appointment cancelled successfully');
      // Optionally, you can update the UI to reflect the cancellation
      // For example, removing the cancelled appointment from the list
      setRecentAppointments(prevAppointments => 
        prevAppointments.filter(app => app.appointmentId !== appointmentId)
      );
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };



  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Doctor Dashboard</h1>
      
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <StatCard title="Total Appointments" value={stats.totalAppointments} icon={<CalendarIcon className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Today's Appointments" value={stats.todayAppointments} icon={<Calendar className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="This Month" value={stats.thisMonthAppointments} icon={<Calendar className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Completed Today" value={stats.completedAppointmentsToday} icon={<Calendar className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Cancelled Today" value={stats.cancelledAppointmentsToday} icon={<Calendar className="h-4 w-4 text-muted-foreground" />} />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side - Recent Appointments */}
        <div className="w-full lg:w-2/3">
          <h2 className="text-xl font-semibold mb-4">Recent Appointments</h2>
          {recentAppointments.length > 0 ? (
            <div className="space-y-4">
              {recentAppointments.map((appointment, index) => (
                <AppointmentCard
                  key={index}
                  appointment={appointment}
                  onStart={() => handleStartAppointment(appointment?.appointmentId)}
                  onCancel={() => handleCancelAppointment(appointment?.appointmentId)}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-4">
                <p className="text-center text-gray-500">No recent appointments</p>
              </CardContent>
            </Card>
          )}
        </div>
        {/* Right Side - Calendar and Next Appointment */}
        <div className="w-full lg:w-1/3">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Current Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="text-gray-500">
                {currentTime.toLocaleDateString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Appointment</CardTitle>
            </CardHeader>
            <CardContent>
              {nextAppointment ? (
                <NextAppointmentCard
                  appointment={nextAppointment}
                  onClick={() => handleStartAppointment(nextAppointment?.patientId)}
                />
              ) : (
                <p className="text-center text-gray-500">No upcoming appointments</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Separate components for better organization and error handling
const StatCard = ({ title, value, icon }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value || 0}</div>
    </CardContent>
  </Card>
);

// const AppointmentCard = ({ appointment, onStart, onCancel }) => {
//   if (!appointment) return null;

//   return (
//     <Card className="hover:shadow-lg transition-shadow">
//       <CardContent className="flex items-center p-4">
//         <Avatar className="h-12 w-12 mr-4">
//           <AvatarImage src={appointment.photo} alt={appointment.patientName} />
//           <AvatarFallback>{appointment.patientName?.charAt(0) || '?'}</AvatarFallback>
//         </Avatar>
//         <div className="flex-grow">
//           <h3 className="font-semibold">{appointment.patientName}</h3>
//           <p className="text-sm text-gray-500">{appointment.description || 'No description'}</p>
//           <div className="flex items-center mt-2 text-sm text-gray-500">
//             <Clock className="h-4 w-4 mr-1" />
//             {appointment.time}
//             <Calendar className="h-4 w-4 ml-3 mr-1" />
//             {new Date(appointment.date).toLocaleDateString()}
//           </div>
//         </div>
//         <div className="flex space-x-2">
//           <Button onClick={onStart}>Start</Button>
//           <Button variant="outline" onClick={onCancel}>Cancel</Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };


// const AppointmentCard = ({ appointment, onStart, onCancel }) => {
//   if (!appointment) return null;

//   const isToday = (dateString) => {
//     const today = new Date();
//     const appointmentDate = new Date(dateString);
//     return (
//       today.getDate() === appointmentDate.getDate() &&
//       today.getMonth() === appointmentDate.getMonth() &&
//       today.getFullYear() === appointmentDate.getFullYear()
//     );
//   };

//   const isPastDate = (dateString) => {
//     const today = new Date();
//     const appointmentDate = new Date(dateString);
//     return appointmentDate < today;
//   };

//   const isFutureDate = (dateString) => {
//     const today = new Date();
//     const appointmentDate = new Date(dateString);
//     return appointmentDate > today;
//   };

//   const startButtonDisabled = isPastDate(appointment.date) || isFutureDate(appointment.date);
//   const cancelButtonDisabled = isPastDate(appointment.date);

//   return (
//     <Card className="hover:shadow-lg transition-shadow">
//       <CardContent className="flex items-center p-4">
//         <Avatar className="h-12 w-12 mr-4">
//           <AvatarImage src={appointment.photo} alt={appointment.patientName} />
//           <AvatarFallback>{appointment.patientName?.charAt(0) || '?'}</AvatarFallback>
//         </Avatar>
//         <div className="flex-grow">
//           <h3 className="font-semibold">{appointment.patientName}</h3>
//           <p className="text-sm text-gray-500">{appointment.description || 'No description'}</p>
//           <div className="flex items-center mt-2 text-sm text-gray-500">
//             <Clock className="h-4 w-4 mr-1" />
//             {appointment.time}
//             <Calendar className="h-4 w-4 ml-3 mr-1" />
//             {new Date(appointment.date).toLocaleDateString()}
//           </div>
//         </div>
//         <div className="flex space-x-2">
//           <Button 
//             onClick={onStart} 
//             disabled={startButtonDisabled}
//           >
//             Start
//           </Button>
//           <Button 
//             variant="outline" 
//             onClick={onCancel} 
//             disabled={cancelButtonDisabled}
//           >
//             Cancel
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };


const AppointmentCard = ({ appointment, onStart, onCancel }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');

  if (!appointment) return null;

  const isToday = (dateString) => {
    const today = new Date();
    const appointmentDate = new Date(dateString);
    return (
      today.getDate() === appointmentDate.getDate() &&
      today.getMonth() === appointmentDate.getMonth() &&
      today.getFullYear() === appointmentDate.getFullYear()
    );
  };

  const isPastDate = (dateString) => {
    const today = new Date();
    const appointmentDate = new Date(dateString);
    return appointmentDate < today;
  };

  const isFutureDate = (dateString) => {
    const today = new Date();
    const appointmentDate = new Date(dateString);
    return appointmentDate > today;
  };

  const startButtonDisabled = isPastDate(appointment.date) || isFutureDate(appointment.date);
  const cancelButtonDisabled = isPastDate(appointment.date);

  const handleCancelClick = () => {
    setIsDialogOpen(true);
  };

  const handleConfirmCancel = () => {
    onCancel(appointment.appointmentId, cancellationReason);
    setIsDialogOpen(false);
    setCancellationReason('');
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="flex items-center p-4">
        <Avatar className="h-12 w-12 mr-4">
          <AvatarImage src={appointment.photo} alt={appointment.patientName} />
          <AvatarFallback>{appointment.patientName?.charAt(0) || '?'}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <h3 className="font-semibold">{appointment.patientName}</h3>
          <p className="text-sm text-gray-500">{appointment.description || 'No description'}</p>
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            {appointment.time}
            <Calendar className="h-4 w-4 ml-3 mr-1" />
            {new Date(appointment.date).toLocaleDateString()}
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={onStart} 
            disabled={startButtonDisabled}
          >
            Start
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline"
                onClick={handleCancelClick}
                disabled={cancelButtonDisabled}
              >
                Cancel
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cancel Appointment</DialogTitle>
              </DialogHeader>
              <p>Are you sure you want to cancel this appointment?</p>
              <Textarea
                placeholder="Reason for cancellation"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  No, keep appointment
                </Button>
                <Button onClick={handleConfirmCancel}>
                  Yes, cancel appointment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};


const NextAppointmentCard = ({ appointment, onClick }) => {
  if (!appointment) return null;
  console.log('dff', appointment);
  return (
    <div className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      <div className="flex items-center mb-4">
        <Avatar className="h-12 w-12 mr-4">
          <AvatarImage src={appointment.photo} alt={appointment.patientName} />
          <AvatarFallback>{appointment.patientName?.charAt(0) || '?'}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{appointment.patientName}</h3>
          <p className="text-sm text-gray-500">{appointment.description || 'No description'}</p>
        </div>
      </div>
      <div className="flex items-center text-sm text-gray-500">
        <Clock className="h-4 w-4 mr-1" />
        {appointment.time}
        <Calendar className="h-4 w-4 ml-3 mr-1" />
        {new Date(appointment.date).toLocaleDateString()}
      </div>
    </div>
  );
};

export default DoctorDashboard;