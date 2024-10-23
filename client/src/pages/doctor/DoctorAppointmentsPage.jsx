import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from "@/components/ui/button"

const DoctorAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [timeframe, setTimeframe] = useState('today');
  const doctorId = localStorage.getItem('id1');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/doctor/${doctorId}`, {
          params: { timeframe }
        });
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    if (doctorId) {
      fetchAppointments();
    }
  }, [timeframe, doctorId]);

  const handleStart = (appointmentId) => {
    navigate(`/doctor-page/appointments/${appointmentId}`);
  };

  const handleCancel = (appointmentId) => {
    navigate(`/doctor-page/appointments/cancel/${appointmentId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Appointments</h1>
      <Select value={timeframe} onValueChange={setTimeframe}>
        <SelectTrigger className="w-[180px] mb-4">
          <SelectValue placeholder="Select timeframe" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today's Appointments</SelectItem>
          <SelectItem value="week">This Week</SelectItem>
          <SelectItem value="month">This Month</SelectItem>
          <SelectItem value="next-month">Next Month</SelectItem>
          <SelectItem value="all">Total Appointments</SelectItem>
        </SelectContent>
      </Select>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment._id}>
              <TableCell>{appointment.patientName}</TableCell>
              <TableCell>{new Date(appointment.date).toLocaleDateString()}</TableCell>
              <TableCell>{appointment.timeSlot}</TableCell>
              <TableCell>{appointment.description}</TableCell>
              <TableCell>{appointment.status}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => handleStart(appointment._id)} 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Start
                  </Button>
                  <Button 
                    onClick={() => handleCancel(appointment._id)} 
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Cancel
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DoctorAppointmentsPage;