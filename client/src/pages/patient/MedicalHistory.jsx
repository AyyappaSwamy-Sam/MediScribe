import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Calendar, Clock, FileText, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const MedicalHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    const id = localStorage.getItem('id1');
    if (!user || user !== 'patient') {
      navigate('/auth');
      return;
    }

    const fetchAppointments = async () => {
      try {
        const response = await fetch(`http://localhost:5004/api/patient/medicalhistory/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, [navigate]);

  const handleCardClick = (appointment) => {
    if (appointment.status.toLowerCase() === 'completed') {
      navigate(`/medical-history/${appointment._id}`);
    }
  };

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'skipped':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Medical History</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appointments.map((appointment) => (
          <Card
            key={appointment._id}
            className={`overflow-hidden transition-all duration-300 ${
              appointment.status.toLowerCase() === 'completed'
                ? 'cursor-pointer hover:shadow-xl'
                : 'cursor-default'
            }`}
            onClick={() => handleCardClick(appointment)}
          >
            <CardContent className="p-6 relative">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">{`Dr. ${appointment.firstName} ${appointment.lastName}`}</h2>
                <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusStyle(appointment.status)}`}>
                  {appointment.status}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{new Date(appointment.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{appointment.timeSlot}</span>
                </div>
                {appointment.description && (
                  <div className="flex items-start text-gray-600 mt-2">
                    <FileText className="w-4 h-4 mr-2 mt-1" />
                    <p className="text-sm">{appointment.description}</p>
                  </div>
                )}
              </div>
              {appointment.status.toLowerCase() === 'completed' ? (
                <div className="mt-4 flex justify-end text-blue-600">
                  <span className="text-sm mr-1">View Details</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              ) : (
                <div className="absolute top-2 right-2">
                  <Lock className="w-4 h-4 text-gray-400" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MedicalHistory;