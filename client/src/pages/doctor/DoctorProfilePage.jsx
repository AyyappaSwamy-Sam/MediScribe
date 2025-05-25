import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, Mail, Phone, MapPin, Book, Award } from 'lucide-react';

const DoctorProfilePage = () => {
  const [doctor, setDoctor] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const user = localStorage.getItem('user');
        const id = localStorage.getItem('id1');
        if (!user || user !== 'doctor') {
          navigate('/auth');
          return;
        }

        const response = await fetch(`http://localhost:5003/api/doctors/my-profile/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch doctor data');
        }
        const doctorData = await response.json();
        setDoctor(doctorData);
      } catch (err) {
        setError(err.message);
      } 
    };

    fetchDoctorData();
  }, [navigate]);

  
  if (error) return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  if (!doctor) return null;

  const { 
    firstName, 
    lastName, 
    specialization, 
    licenseNumber, 
    experience, 
    available, 
    photoPath, 
    description, 
    education,
    availableTimeSlots,
    email
  } = doctor;

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
          <div className="flex items-center space-x-4">
            <Avatar className="w-24 h-24 border-4 border-white">
              <AvatarImage src={photoPath} alt={`${firstName} ${lastName}`} />
              <AvatarFallback>{firstName[0]}{lastName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">Dr. {firstName} {lastName}</h1>
              <p className="text-xl">{specialization}</p>
              <Badge className="mt-2" variant={available ? "success" : "destructive"}>
                {available ? "Available" : "Unavailable"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-gray-500" />
            <span>{email}</span>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">About</h2>
            <p className="text-gray-700">{description}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Details</h2>
            <ul className="space-y-2">
              <li className="flex items-center space-x-3">
                <Award className="w-5 h-5 text-gray-500" />
                <span><strong>License Number:</strong> {licenseNumber}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span><strong>Experience:</strong> {experience} years</span>
              </li>
              <li className="flex items-center space-x-3">
                <Book className="w-5 h-5 text-gray-500" />
                <span><strong>Education:</strong> {education}</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Available Time Slots</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {availableTimeSlots.map((slot, index) => (
                <Card key={index} className="bg-gray-50">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-medium flex items-center mb-2">
                      <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                      {slot.day}
                    </h3>
                    <ul className="text-sm space-y-1">
                      {slot.slots.map((time, timeIndex) => (
                        <li key={timeIndex} className="text-gray-600">{time}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfilePage;