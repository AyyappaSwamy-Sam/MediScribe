import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom'; // Import NavLink
import axios from 'axios';
import { format, isSameDay } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Briefcase, Mail, Phone } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { assets } from '../../assets/assets_frontend/assets';
import { isBefore, startOfDay } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Check, AlertTriangle } from "lucide-react";

const AppointmentBookingPage = () => {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [description, setDescription] = useState('');
  const [bookingStatus, setBookingStatus] = useState(null);
  const today = startOfDay(new Date());
  const { toast } = useToast();

  useEffect(() => {
    const fetchDoctorInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/appointments/${doctorId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setDoctor(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching doctor info:', error);
      }
    };

    fetchDoctorInfo();
  }, [doctorId]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleBook = async () => {
    if (selectedDate && selectedTime && description) {
      try {
        const response = await axios.post('http://localhost:5000/api/appointments/book', {
          doctorId: doctorId,
          patientId: localStorage.getItem('id1'),
          date: format(selectedDate, 'yyyy-MM-dd'),
          timeSlot: selectedTime,
          description: description
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        // Check the response and update booking status accordingly
        console.log(response);
        if (response.status === 201) {
          setBookingStatus('success');
          toast({
            title: "Appointment Successfully Created",
            description: "Friday, February 10, 2023 at 5:57 PM",
            variant: "default",
            position: "bottom",
            className: "bg-green-200 border-green-400",
            duration: 5000,
            action: <Check className="h-6 w-6 text-green-600" />,
            style: {
              width: '300px',
              height: '80px',
            },
          });
        } else if (response.status === 200) {
          setBookingStatus('error');
          toast({
            title: "Appointment Already Booked",
            description: "Friday, February 10, 2023 at 5:57 PM",
            variant: "default",
            position: "bottom",
            className: "bg-yellow-200 border-yellow-400",
            duration: 5000,
            action: <AlertTriangle className="h-6 w-6 text-yellow-600" />,
            style: {
              width: '300px',
              height: '80px',
            },
          });
        }
      } catch (error) {
        console.error('Error booking appointment:', error.message);
        if (error.response && error.response.status === 500) {
          setBookingStatus('serverError');
        } else {
          setBookingStatus('error');
        }
      }
    } else {
      setBookingStatus('error');
      console.warn('Missing required fields');
    }
  };

  const getAvailableTimeSlots = () => {
    if (!doctor || !doctor.availableTimeSlots || !selectedDate) return [];

    const dayOfWeek = format(selectedDate, 'EEEE');
    const availableDay = doctor.availableTimeSlots.find(day => day.day === dayOfWeek);

    return availableDay ? availableDay.slots : [];
  };

  const isDateDisabled = (date) => {
    if (isBefore(date, today)) return true;

    if (!doctor || !doctor.availableTimeSlots) return true;

    const dayOfWeek = format(date, 'EEEE');

    return !doctor.availableTimeSlots.some(day => day.day === dayOfWeek);
  };

  if (!doctor) {
    return <div className="flex justify-center items-center h-screen">Doctor not found</div>;
  };

  const InfoItem = ({ icon: Icon, text }) => (
    <div className="flex items-center space-x-2 text-sm">
      <Icon className="w-4 h-4 text-muted-foreground" />
      <span>{text}</span>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      {/* Navigation Section */}
      <nav className="flex space-x-4 items-center p-4 bg-white-100 mb-6">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? 'underline' : 'hover:underline text-gray-600'
          }
        >
          Home
        </NavLink>

        {/* Arrow between links */}
        <span className="text-gray-500">→</span>

        <NavLink
          to="/doctors"
          className={({ isActive }) =>
            isActive ? '' : 'hover:underline text-gray-600'
          }
        >
          Find a Doctor
        </NavLink>

        {/* Arrow between links */}
        <span className="text-gray-500">→</span>

        <NavLink
          className={({ isActive }) =>
            isActive ? 'font-bold underline' : 'hover:underline text-gray-600'
          }
        >
          Appointments
        </NavLink>
      </nav>

      <Toaster />
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/5">
              <Avatar className="w-30 h-30 aspect-square" >
                <AvatarImage src={assets.doctor1} alt={`${doctor.firstName} ${doctor.lastName}`} />
                <AvatarFallback>{`${doctor.firstName[0]}${doctor.lastName[0]}`}</AvatarFallback>
              </Avatar>
            </div>
            <div className="md:w-2/3 space-y-4">
              <div>
                <h2 className="text-2xl font-bold">{`Dr. ${doctor.firstName} ${doctor.lastName}`}</h2>
                <p className="text-muted-foreground">{doctor.specialization}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InfoItem icon={Mail} text={doctor.email} />
                <InfoItem icon={Phone} text={doctor.phoneNumber} />
                <InfoItem icon={Briefcase} text={`${doctor.experience} years experience`} />
                <InfoItem icon={User} text={doctor.available ? 'Available' : 'Not Available'} />
              </div>
              <p className="text-sm text-muted-foreground">{doctor.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className='mt-10'>
          <h2 className="text-xl font-bold mb-4">Select Date</h2>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            className="rounded-md border flex justify-center items-center"
          />
        </div>
        <div className='mt-10'>
          <h2 className="text-xl font-bold mb-4">Book Appointment</h2>
          <Card>
            <CardContent>
              {selectedDate && (
                <>
                  <h3 className="text-lg mt-3 font-semibold mb-2">Available Time Slots</h3>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {getAvailableTimeSlots().map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? 'default' : 'outline'}
                        onClick={() => handleTimeSelect(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                  <Textarea
                    placeholder="Add description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mb-4"
                  />
                  <Button onClick={handleBook}>Book Appointment</Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      {bookingStatus === 'error' && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Appointment Booking Error</AlertTitle>
          <AlertDescription>Unable to book the appointment. Please check your inputs.</AlertDescription>
        </Alert>
      )}
      {bookingStatus === 'serverError' && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Server Error</AlertTitle>
          <AlertDescription>There was an issue with the server. Please try again later.</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AppointmentBookingPage;
