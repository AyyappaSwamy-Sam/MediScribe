import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, PhoneIcon, Mail, User } from 'lucide-react';

const MyProfile =() =>{
  const [patientData, setPatientData] = useState(null);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientData = async () => {
      const user = localStorage.getItem('user');
      const id = localStorage.getItem('id1');

      if (!user || user !== 'patient') {
        navigate('/auth');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5004/api/patient/my-profile/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch patient data');
        }
        const data = await response.json();
        setPatientData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        // setLoading(false);
      }
    };

    fetchPatientData();
  }, [navigate]);

  // if (loading) {
  //   return <div className="flex justify-center items-center h-screen">Loading...</div>;
  // }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!patientData) {
    return <div className="text-center">No patient data available</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="bg-white shadow-xl rounded-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
              <AvatarImage src={patientData.photourl} alt={`${patientData.firstName} ${patientData.lastName}`} />
              <AvatarFallback>{patientData.firstName[0]}{patientData.lastName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-3xl font-bold">
                {patientData.firstName} {patientData.lastName}
              </CardTitle>
              <Badge variant="secondary" className="mt-2">
                {patientData.emrSystem}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem icon={<CalendarIcon className="h-5 w-5 text-blue-500" />} label="Date of Birth" value={new Date(patientData.dob).toLocaleDateString()} />
            <InfoItem icon={<PhoneIcon className="h-5 w-5 text-green-500" />} label="Phone Number" value={patientData.phoneNumber} />
            <InfoItem icon={<Mail className="w-5 h-5 text-gray-500" />} label="Email" value={patientData.email} />
            <InfoItem icon={<User className="h-5 w-5 text-indigo-500" />} label="Gender" value={patientData.gender} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
    {icon}
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

export default MyProfile;