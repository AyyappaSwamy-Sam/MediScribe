import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Calendar, Search, Clock, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from 'axios';

const AdminAppointments = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Fetch doctors from backend
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/doctors-list');
        console.log(response);
        setDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };
    
    // Fetch appointments from backend
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/appointment-list');
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchDoctors();
    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.doctorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = !selectedDate || appointment.date === selectedDate;
    console.log(appointment.doctorName, selectedDoctor);
    const matchesDoctor = selectedDoctor === 'all' || appointment.doctorName === selectedDoctor;
    return matchesSearch && matchesDate && matchesDoctor;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      
      {/* Main Content */}
      <Card className="mx-auto max-w-6xl">
        <CardHeader>
          <CardTitle>Manage Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Section */}
          <div className="mb-6 grid gap-4 md:grid-cols-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search appointments..."
                className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Date Filter */}
            <div className="relative">
              <input
                type="date"
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            {/* Doctor Filter */}
            <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
              <SelectTrigger>
                <SelectValue placeholder="Select Doctor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Doctors</SelectItem>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.name}>
                    {doctor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Appointments Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="py-3 px-4 font-medium text-gray-900">Patient</th>
                  <th className="py-3 px-4 font-medium text-gray-900">Doctor</th>
                  <th className="py-3 px-4 font-medium text-gray-900">Date</th>
                  <th className="py-3 px-4 font-medium text-gray-900">Time</th>
                  <th className="py-3 px-4 font-medium text-gray-900">Type</th>
                  <th className="py-3 px-4 font-medium text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-500" />
                        </div>
                        <span>{appointment.patientName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">{appointment.doctorName}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {appointment.date}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        {appointment.timeSlot}
                      </div>
                    </td>
                    <td className="py-4 px-4">{appointment.description}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
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

export default AdminAppointments;