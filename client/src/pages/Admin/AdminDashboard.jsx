
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart, Bar } from 'recharts';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import { User,Users, UserPlus, Calendar, MessageSquare, TrendingUp, TrendingDown } from 'lucide-react';

const AdminDashboard = () => {
  const adminName = "Dr. Sarah Wilson";
  
  // Stats with week-over-week changes
  const stats = [
    { 
      title: 'Total Patients',
      value: '2,845',
      subtitle: 'From last week',
      change: '+12.5%',
      increasing: true,
      icon: Users,
      color: 'indigo'
    },
    { 
      title: 'New Patients',
      value: '145',
      subtitle: 'From last week',
      change: '+8.2%',
      increasing: true,
      icon: UserPlus,
      color: 'emerald'
    },
    { 
      title: 'Appointments',
      value: '328',
      subtitle: 'From last week',
      change: '-3.1%',
      increasing: false,
      icon: Calendar,
      color: 'yellow'
    },
    { 
      title: 'Patient Feedback',
      value: '4.8/5',
      subtitle: 'From last week',
      change: '+0.3',
      increasing: true,
      icon: MessageSquare,
      color: 'red'
    }
  ];

  // Rest of the data remains same as before
  const appointmentData = [
    { month: 'Jan', appointments: 250 },
    { month: 'Feb', appointments: 280 },
    { month: 'Mar', appointments: 270 },
    { month: 'Apr', appointments: 290 },
    { month: 'May', appointments: 320 },
    { month: 'Jun', appointments: 350 },
    { month: 'Jul', appointments: 380 },
    { month: 'Aug', appointments: 360 },
    { month: 'Sep', appointments: 400 },
    { month: 'Oct', appointments: 420 },
    { month: 'Nov', appointments: 450 },
    { month: 'Dec', appointments: 480 }
  ];

  const specialtyData = [
    { name: 'Cardiology', patients: 450 },
    { name: 'Pediatrics', patients: 380 },
    { name: 'Orthopedics', patients: 320 },
    { name: 'Neurology', patients: 280 },
    { name: 'Dermatology', patients: 250 },
    { name: 'General', patients: 520 },
    { name: 'Ophthalmology', patients: 210 },
    { name: 'ENT', patients: 180 },
    { name: 'Psychiatry', patients: 160 },
    { name: 'Dental', patients: 290 }
  ];

  const genderData = [
    { name: 'Male', value: 1366, percentage: '48%' },
    { name: 'Female', value: 1479, percentage: '52%' }
  ];

  // Custom Avatar Component
  const AvatarIcon = () => (
    <svg className="w-20 h-20" viewBox="0 0 100 100">
      <circle cx="50" cy="35" r="25" fill="#4F46E5" />
      <circle cx="50" cy="30" r="8" fill="white" />
      <path
        d="M25 90 Q50 60 75 90"
        fill="#4F46E5"
        strokeWidth="2"
      />
      <circle cx="42" cy="28" r="3" fill="#1E1B4B" />
      <circle cx="58" cy="28" r="3" fill="#1E1B4B" />
    </svg>
  );
  const upcomingAppointments = [
    {
      patientName: "John Doe",
      doctor: "Dr. Smith",
      specialty: "Cardiology",
      dateTime: "2024-10-25 09:00 AM",
      age: 45,
      description: "Regular Checkup",
      gender: "Male"
    },
    {
      patientName: "Jane Smith",
      doctor: "Dr. Johnson",
      specialty: "Pediatrics",
      dateTime: "2024-10-25 10:30 AM",
      age: 8,
      description: "Vaccination",
      gender: "Female"
    },
    {
      patientName: "Robert Brown",
      doctor: "Dr. Williams",
      specialty: "Orthopedics",
      dateTime: "2024-10-25 11:45 AM",
      age: 62,
      description: "Follow-up",
      gender: "Male"
    },
    {
      patientName: "Emily Davis",
      doctor: "Dr. Anderson",
      specialty: "Dermatology",
      dateTime: "2024-10-25 02:15 PM",
      age: 35,
      description: "Consultation",
      gender: "Female"
    }
  ];
  const GENDER_COLORS = ['#3B82F6', '#EC4899'];


// import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import { BarChart, Bar } from 'recharts';
// import { PieChart, Pie, Cell, Legend } from 'recharts';
// import { User, Users, UserPlus, Calendar, MessageSquare, TrendingUp, TrendingDown } from 'lucide-react';
// import axios from 'axios';

// // Create axios instance with default config
// const api = axios.create({
//   baseURL: 'http://localhost:5000/api/admin',
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// // Add authentication interceptor
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// const AdminDashboard = () => {
//   // State management for all data
//   const [stats, setStats] = useState([]);
//   const [appointmentData, setAppointmentData] = useState([]);
//   const [specialtyData, setSpecialtyData] = useState([]);
//   const [genderData, setGenderData] = useState([]);
//   const [upcomingAppointments, setUpcomingAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const GENDER_COLORS = ['#3B82F6', '#EC4899'];

//   // Fetch all dashboard data
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);
//         const [
//           statsRes,
//           appointmentsRes,
//           specialtiesRes,
//           genderRes,
//           upcomingRes
//         ] = await Promise.all([
//           api.get('/dashboard/stats'),
//           api.get('/dashboard/appointments-trend'),
//           api.get('/dashboard/specialty-distribution'),
//           api.get('/dashboard/gender-distribution'),
//           api.get('/appointments/upcoming')
//         ]);

//         setStats(statsRes.data);
//         setAppointmentData(appointmentsRes.data);
//         setSpecialtyData(specialtiesRes.data);
//         setGenderData(genderRes.data);
//         setUpcomingAppointments(upcomingRes.data);
//       } catch (err) {
//         setError(err.message);
//         console.error('Error fetching dashboard data:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>; // Consider using a proper loading component
//   }

//   if (error) {
//     return <div>Error loading dashboard: {error}</div>; // Consider using a proper error component
//   }

  return (
    <div className="p-6  min-h-screen">
      {/* Welcome Card */}
      <div className="py-4">
      {/* Decorative Elements */}
      <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-500/10 rounded-full blur-xl" />
      <div className="absolute top-10 right-20 w-16 h-16 bg-indigo-500/10 rounded-full blur-lg" />
      
      {/* Triangular Decorations */}
      <div className="absolute top-0 right-0 w-0 h-0 border-t-[100px] border-r-[100px] border-t-purple-500/5 border-r-transparent" />
      <div className="absolute bottom-0 left-20 w-0 h-0 border-b-[60px] border-l-[60px] border-b-indigo-500/5 border-l-transparent" />

      <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-700 border-none ">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left Section with Welcome Message */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white">
                  Welcome to Mediscribe
                </h1>
              </div>
              <p className="text-indigo-100 text-lg max-w-md">
                Have a nice day!
              </p>

              <div className="">
                <p className="text-xl font-medium text-white">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                </p>
                <p className="text-indigo-100">
                  {new Date().toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            {/* Right Section with Date and Lottie Animation */}
            <div className="flex flex-col">
              {/* Lottie Animation Container */}
              <div className="w-60 h-50">
              <iframe src="https://lottie.host/embed/d1d04eae-2e3b-4666-8f54-0e80a27988f6/Zv5yPAQvmy.json" className="w-60 h-50"
                  title="Welcome Animation"/>
                
              </div>
             
              
            
            </div>
          </div>

          {/* Decorative Bottom Pattern */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </CardContent>
      </Card>
    </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-3">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className="hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-${stat.color}-100/30`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
              <div className={`flex flex-col ${stat.increasing ? 'text-emerald-600' : 'text-red-600'} 
                px-2 py-1 rounded-lg bg-${stat.increasing ? 'emerald' : 'red'}-100/30`}
              >
                {stat.increasing ? 
                  <TrendingUp className="h-4 w-4 mr-1" /> : 
                  <TrendingDown className="h-4 w-4 mr-1" />
                }
                <span className="text-sm font-medium">{stat.change}</span>
                <p className="text-xs text-gray-500">{stat.subtitle}</p>
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              <p className="text-sm font-medium text-gray-800">{stat.title}</p>
              
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Appointments Trend */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Appointments Trend</span>
              <span className="text-sm text-green-500 font-normal flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                +12.5% from last month
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={appointmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="appointments" 
                    stroke="#4F46E5"
                    strokeWidth={2}
                    dot={{ fill: '#4F46E5' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gender Distribution with Details */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={GENDER_COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                {genderData.map((item, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-sm text-gray-600">{item.percentage}</span>
                    </div>
                    <div className="text-2xl font-bold" style={{ color: GENDER_COLORS[index] }}>
                      {item.value.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        
      </div>
      {/* Specialty Distribution */}
      <Card className="hover:shadow-lg transition-shadow duration-200 mb-4">
          <CardHeader>
            <CardTitle>Patients by Specialty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={specialtyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                  />
                  <Bar 
                    dataKey="patients" 
                    fill="#4F46E5"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      {/* Upcoming Appointments Table */}
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <div className='flex justify-between items-center p-4'>
          <h1 className='text-xm text-black font-bold'>Upcoming Appointments</h1>
          
            <a href="/appointments" className="text-blue-900 font-bold decoration-blue-900" >
              Show More
            </a>
          
        </div>

        <CardContent>
          <div className="overflow-x-auto">
             <table className="w-full">
               <thead>
                 <tr className="border-b">
                   <th className="text-left p-4 text-gray-600">Patient Name</th>
                   <th className="text-left p-4 text-gray-600">Doctor</th>
                   <th className="text-left p-4 text-gray-600">Specialty</th>
                   <th className="text-left p-4 text-gray-600">Date & Time</th>
                   <th className="text-left p-4 text-gray-600">Age</th>
                   <th className="text-left p-4 text-gray-600">Gender</th>
                   <th className="text-left p-4 text-gray-600">Description</th>
                 </tr>
               </thead>
               <tbody>
                 {upcomingAppointments.map((appointment, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-4">{appointment.patientName}</td>
                    <td className="p-4">{appointment.doctor}</td>
                    <td className="p-4">{appointment.specialty}</td>
                    <td className="p-4">{appointment.dateTime}</td>
                    <td className="p-4">{appointment.age}</td>
                    <td className="p-4">{appointment.gender}</td>
                    <td className="p-4">{appointment.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;




// import React from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import { BarChart, Bar } from 'recharts';
// import { PieChart, Pie, Cell, Legend } from 'recharts';
// import { Users, UserPlus, Calendar, Activity, TrendingUp, TrendingDown, ChevronRight, ArrowRight } from 'lucide-react';

// const AdminDashboard = () => {
//   const adminName = "Dr. Sarah Wilson";
  
//   // Enhanced stats with week-over-week changes and last week values
//   const stats = [
//     { 
//       title: 'Total Patients',
//       value: '2,845',
//       lastWeek: '2,780',
//       change: '+12.5%',
//       increasing: true,
//       icon: Users,
//       color: 'blue'
//     },
//     { 
//       title: 'New Patients',
//       value: '145',
//       lastWeek: '134',
//       change: '+8.2%',
//       increasing: true,
//       icon: UserPlus,
//       color: 'green'
//     },
//     { 
//       title: 'Appointments',
//       value: '328',
//       lastWeek: '338',
//       change: '-3.1%',
//       increasing: false,
//       icon: Calendar,
//       color: 'purple'
//     },
//     { 
//       title: 'Active Cases',
//       value: '182',
//       lastWeek: '173',
//       change: '+5.4%',
//       increasing: true,
//       icon: Activity,
//       color: 'red'
//     }
//   ];
//   const appointmentData = [
//     { month: 'Jan', appointments: 250 },
//     { month: 'Feb', appointments: 280 },
//     { month: 'Mar', appointments: 270 },
//     { month: 'Apr', appointments: 290 },
//     { month: 'May', appointments: 320 },
//     { month: 'Jun', appointments: 350 },
//     { month: 'Jul', appointments: 380 },
//     { month: 'Aug', appointments: 360 },
//     { month: 'Sep', appointments: 400 },
//     { month: 'Oct', appointments: 420 },
//     { month: 'Nov', appointments: 450 },
//     { month: 'Dec', appointments: 480 }
//   ];

//   // Enhanced specialty data with 10 specialties
  // const specialtyData = [
  //   { name: 'Cardiology', patients: 450 },
  //   { name: 'Pediatrics', patients: 380 },
  //   { name: 'Orthopedics', patients: 320 },
  //   { name: 'Neurology', patients: 280 },
  //   { name: 'Dermatology', patients: 250 },
  //   { name: 'General Medicine', patients: 520 },
  //   { name: 'Ophthalmology', patients: 210 },
  //   { name: 'ENT', patients: 180 },
  //   { name: 'Psychiatry', patients: 160 },
  //   { name: 'Dental', patients: 290 }
  // ];

//   // Enhanced appointments data
  // const upcomingAppointments = [
  //   {
  //     patientName: "John Doe",
  //     doctor: "Dr. Smith",
  //     specialty: "Cardiology",
  //     dateTime: "2024-10-25 09:00 AM",
  //     age: 45,
  //     description: "Regular Checkup",
  //     gender: "Male"
  //   },
  //   {
  //     patientName: "Jane Smith",
  //     doctor: "Dr. Johnson",
  //     specialty: "Pediatrics",
  //     dateTime: "2024-10-25 10:30 AM",
  //     age: 8,
  //     description: "Vaccination",
  //     gender: "Female"
  //   },
  //   {
  //     patientName: "Robert Brown",
  //     doctor: "Dr. Williams",
  //     specialty: "Orthopedics",
  //     dateTime: "2024-10-25 11:45 AM",
  //     age: 62,
  //     description: "Follow-up",
  //     gender: "Male"
  //   },
  //   {
  //     patientName: "Emily Davis",
  //     doctor: "Dr. Anderson",
  //     specialty: "Dermatology",
  //     dateTime: "2024-10-25 02:15 PM",
  //     age: 35,
  //     description: "Consultation",
  //     gender: "Female"
  //   }
  // ];

//   // Enhanced gender data with more details
//   const genderData = [
//     { 
//       name: 'Male', 
//       value: 1366, 
//       percentage: '48%',
//       ageGroups: {
//         '0-18': 245,
//         '19-40': 486,
//         '41-60': 412,
//         '60+': 223
//       }
//     },
//     { 
//       name: 'Female', 
//       value: 1479, 
//       percentage: '52%',
//       ageGroups: {
//         '0-18': 268,
//         '19-40': 524,
//         '41-60': 445,
//         '60+': 242
//       }
//     }
//   ];
//   const AvatarIcon = () => (
//     <svg className="w-20 h-20" viewBox="0 0 100 100">
//       <circle cx="50" cy="35" r="25" fill="#4F46E5" />
//       <circle cx="50" cy="30" r="8" fill="white" />
//       <path
//         d="M25 90 Q50 60 75 90"
//         fill="#4F46E5"
//         strokeWidth="2"
//       />
//       <circle cx="42" cy="28" r="3" fill="#1E1B4B" />
//       <circle cx="58" cy="28" r="3" fill="#1E1B4B" />
//     </svg>
//   );

//   const GENDER_COLORS = ['#3B82F6', '#EC4899'];

//   // Keep existing components (AvatarIcon, etc.)...

//   return (
//     <div className="p-6 min-h-screen">
//       {/* Welcome Card remains the same */}
//       <Card className="mb-6 bg-gradient-to-r from-indigo-500 to-purple-600">
//         <CardContent className="flex items-center justify-between p-6">
//           <div className="flex items-center space-x-6">
//             <div className="bg-white p-2 rounded-lg">
//               <AvatarIcon />
//             </div>
//             <div className="text-white">
//               <h1 className="text-3xl font-bold mb-2">Welcome back, {adminName}!</h1>
//               <p className="text-indigo-100">Have a great day at work</p>
//             </div>
//           </div>
//           <div className="hidden md:block">
//             <div className="text-white text-right">
//               <p className="text-xl font-semibold">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</p>
//               <p className="text-indigo-100">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//       {/* Enhanced Stats Overview */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         {stats.map((stat, index) => (
//           <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
//                   <stat.icon className={`h-6 w-6 text-${stat.color}-500`} />
//                 </div>
//                 <div className={`flex items-center ${stat.increasing ? 'text-green-500' : 'text-red-500'}`}>
//                   {stat.increasing ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
//                   <span className="text-sm font-medium">{stat.change}</span>
//                 </div>
//               </div>
//               <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
//               <p className="text-sm text-gray-600">{stat.title}</p>
//               <div className="mt-2 text-sm text-gray-500">
//                 Last week: {stat.lastWeek}
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
      
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//         {/* Appointments Trend */}
//         <Card className="hover:shadow-lg transition-shadow duration-200">
//           <CardHeader>
//             <CardTitle className="flex items-center justify-between">
//               <span>Appointments Trend</span>
//               <span className="text-sm text-green-500 font-normal flex items-center">
//                 <TrendingUp className="h-4 w-4 mr-1" />
//                 +12.5% from last month
//               </span>
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={appointmentData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
//                   <XAxis dataKey="month" stroke="#6B7280" />
//                   <YAxis stroke="#6B7280" />
//                   <Tooltip 
//                     contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }}
//                   />
//                   <Line 
//                     type="monotone" 
//                     dataKey="appointments" 
//                     stroke="#4F46E5"
//                     strokeWidth={2}
//                     dot={{ fill: '#4F46E5' }}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Enhanced Gender Distribution with Age Groups */}
//       <Card className="mb-6 hover:shadow-lg transition-shadow duration-200">
//         <CardHeader className="flex flex-row items-center justify-between">
//           <CardTitle>Gender Distribution</CardTitle>
//           <button 
//             onClick={() => {/* Handle navigation */}}
//             className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
//           >
//             View Details <ArrowRight className="h-4 w-4 ml-1" />
//           </button>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <div className="h-64">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={genderData}
//                     innerRadius={60}
//                     outerRadius={80}
//                     paddingAngle={5}
//                     dataKey="value"
//                   >
//                     {genderData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={GENDER_COLORS[index]} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {genderData.map((gender, index) => (
//                 <div key={index} className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="font-medium" style={{ color: GENDER_COLORS[index] }}>{gender.name}</span>
//                     <span className="text-sm text-gray-600">{gender.percentage}</span>
//                   </div>
//                   <div className="text-2xl font-bold mb-2" style={{ color: GENDER_COLORS[index] }}>
//                     {gender.value.toLocaleString()}
//                   </div>
//                   <div className="space-y-1">
//                     {Object.entries(gender.ageGroups).map(([age, count]) => (
//                       <div key={age} className="flex justify-between text-sm">
//                         <span className="text-gray-600">{age}</span>
//                         <span className="font-medium">{count}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Enhanced Appointments Table */}
//       <Card className="mb-6 hover:shadow-lg transition-shadow duration-200">
//         <CardHeader className="flex flex-row items-center justify-between">
//           <CardTitle>Upcoming Appointments</CardTitle>
//           <button 
//             onClick={() => {/* Handle navigation */}}
//             className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
//           >
//             View All <ChevronRight className="h-4 w-4 ml-1" />
//           </button>
//         </CardHeader>
//         <CardContent>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b">
//                   <th className="text-left p-4 text-gray-600">Patient Name</th>
//                   <th className="text-left p-4 text-gray-600">Doctor</th>
//                   <th className="text-left p-4 text-gray-600">Specialty</th>
//                   <th className="text-left p-4 text-gray-600">Date & Time</th>
//                   <th className="text-left p-4 text-gray-600">Age</th>
//                   <th className="text-left p-4 text-gray-600">Gender</th>
//                   <th className="text-left p-4 text-gray-600">Description</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {upcomingAppointments.map((appointment, index) => (
//                   <tr key={index} className="border-b hover:bg-gray-50">
//                     <td className="p-4">{appointment.patientName}</td>
//                     <td className="p-4">{appointment.doctor}</td>
//                     <td className="p-4">{appointment.specialty}</td>
//                     <td className="p-4">{appointment.dateTime}</td>
//                     <td className="p-4">{appointment.age}</td>
//                     <td className="p-4">{appointment.gender}</td>
//                     <td className="p-4">{appointment.description}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Rest of the components remain the same */}
//       <Card className="hover:shadow-lg transition-shadow duration-200">
//           <CardHeader>
//             <CardTitle>Patients by Specialty</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={specialtyData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
//                   <XAxis dataKey="name" stroke="#6B7280" />
//                   <YAxis stroke="#6B7280" />
//                   <Tooltip 
//                     contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }}
//                   />
//                   <Bar 
//                     dataKey="patients" 
//                     fill="#4F46E5"
//                     radius={[4, 4, 0, 0]}
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </CardContent>
//         </Card>
     

//     </div>
//   );
// };

// export default AdminDashboard;
