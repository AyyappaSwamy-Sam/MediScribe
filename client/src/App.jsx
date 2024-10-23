import React from 'react';
import { Route, Routes } from 'react-router-dom';
import "@fontsource/manrope";
import './App.css';
import Home from './pages/content/Home';
import Doctor from './pages/patient/Doctor';
import Contact from './pages/content/Contact';
import Login from './pages/Authentication/Login';
import MyProfile from './pages/patient/MyProfile';
import MyAppointments from './pages/patient/MyAppointments';
import About from './pages/content/About';
import AppointmentBookingPage from './pages/patient/Appointment';
import Layout from './pages/content/Layout';
import MedicalHistory from './pages/patient/MedicalHistory';
import { AuthProvider } from './context/AuthContext';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorAppointmentsPage from './pages/doctor/DoctorAppointmentsPage';
import LayoutDoctor from './pages/content/LayoutDoctor';
import DoctorPatientPage from './pages/doctor/DoctorPatientPage';
import DoctorProfilePage from './pages/doctor/DoctorProfilePage';
import MedicalHistoryDetails from './pages/patient/MedicalHistoryDetails';
import LayoutAdmin from './pages/content/LayoutAdmin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminDoctors from './pages/Admin/AdminDoctors';
import AdminAppointments from './pages/Admin/AdminAppointments';
import Invoice from './pages/Admin/Invoice';
import AdminAddDoctor from './pages/Admin/AdminAddDoctor';

// Admin components

function AppContent() {
  console.log('hvkudfbvdfj');
  const user = localStorage.getItem('user');
  console.log('app.jsx', user);

  return (
    <div className='mx-4 sm:mx-[10%]'>
      <Routes>
        <Route path='/auth' element={<Login />} />
        {/* Conditional rendering based on user type */}

        {user === 'doctor' ? (
          <Route path="/" element={<LayoutDoctor />}>
            <Route path='/doctor-page' element={<DoctorDashboard />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/my-profile' element={<DoctorProfilePage />} />
            <Route path='/doctor-page/appointments' element={<DoctorAppointmentsPage />} />
            <Route path='/doctor-page/appointments/:appointmentId' element={<DoctorPatientPage />} />
          </Route>
        ) : null}

        {user === 'patient' ? (
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='/doctors' element={<Doctor />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/medical-history' element={<MedicalHistory />} />
            <Route path='/medical-history/:id' element={<MedicalHistoryDetails />} />
            <Route path='/doctors/:speciality' element={<Doctor />} />
            <Route path='/my-profile' element={<MyProfile />} />
            <Route path='/my-appointments' element={<MyAppointments />} />
            <Route path='/appointments/:doctorId' element={<AppointmentBookingPage />} />
          </Route>
        ) : null}

        {/* Admin route integration */}
        {user === 'admin' ? (
          <Route path="/" element={<LayoutAdmin />}>
            <Route path='/admin-dashboard' element={<AdminDashboard />} />
            <Route path='/admin-doctors' element={<AdminDoctors />} />
            <Route path='/admin-appointments' element={<AdminAppointments />} />
            <Route path='/admin-invoice' element={<Invoice />} /> 
            <Route path='/admin-add-doctor' element={<AdminAddDoctor />} />
          </Route>
        ) : null}

        <Route path='*' element={<Login />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
