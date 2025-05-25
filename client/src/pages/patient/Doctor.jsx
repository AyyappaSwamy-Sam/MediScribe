import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {useAuth} from '../../context/AuthContext'

const Doctor = () => {
  const [specialties, setSpecialties] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [doctors, setDoctors] = useState([]);
  
  const navigate = useNavigate();
  const {checkAuthStatus} = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
    } else {
      // await checkAuthStatus();
      fetchSpecialties();
    }
  }, [navigate]);

  

  useEffect(() => {
    if (selectedSpecialty) {
      fetchDoctors(selectedSpecialty);
    }
  }, [selectedSpecialty]);

  const fetchSpecialties = async () => {
    try {
      const response = await axios.get('http://localhost:5004/api/specialties', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSpecialties(response.data);
    } catch (error) {
      console.error('Error fetching specialties:', error);
      if (error.response && error.response.status === 401) {
        navigate('/auth');
      }
    }
  };

  const fetchDoctors = async (specialtyId) => {
   
    try {
      const response = await axios.get(`http://localhost:5004/api/specialty/${specialtyId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
    
  };
  const handleAppointment= (doctor)=>{
    navigate(`/appointments/${doctor._id}`)
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Find a Doctor</h1>
      <Select onValueChange={setSelectedSpecialty}>
        <SelectTrigger className="w-[280px] mb-4">
          <SelectValue placeholder="Select a specialty" />
        </SelectTrigger>
        <SelectContent>
          {specialties.map((specialty) => (
            <SelectItem key={specialty._id} value={specialty._id}>
              {specialty.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.map((doctor) => (
          <Card key={doctor._id}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={doctor.photoPath} alt={`${doctor.user.firstName} ${doctor.user.lastName}`} />
                  <AvatarFallback>{`${doctor.user.firstName[0]}${doctor.user.lastName[0]}`}</AvatarFallback>
                </Avatar>
                <span>{`${doctor.user.firstName} ${doctor.user.lastName}`}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Specialty:</strong> {specialties.find((spec) => spec._id === doctor.specialty).name}</p>
              <p><strong>Experience:</strong> {doctor.experience} years</p>
              <p><strong>Status:</strong> {doctor.available ? 'Available' : 'Not Available'}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={()=>handleAppointment(doctor)} disabled={!doctor.available}>
                {doctor.available ? 'Book Appointment' : 'Not Available'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Doctor;



// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { Calendar } from "@/components/ui/calendar";
// import { useAuth } from '../../context/AuthContext';

// const Doctor = () => {
//   const [specialties, setSpecialties] = useState([]);
//   const [selectedSpecialty, setSelectedSpecialty] = useState("");
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedDoctor, setSelectedDoctor] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
//   const navigate = useNavigate();
//   const { checkAuthStatus } = useAuth();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/auth');
//     } else {
//       fetchSpecialties();
//     }
//   }, [navigate]);

//   useEffect(() => {
//     if (selectedSpecialty) {
//       fetchDoctors(selectedSpecialty);
//     }
//   }, [selectedSpecialty]);

//   const fetchSpecialties = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/specialties', {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       setSpecialties(response.data);
//     } catch (error) {
//       console.error('Error fetching specialties:', error);
//       if (error.response && error.response.status === 401) {
//         navigate('/auth');
//       }
//     }
//   };

//   const fetchDoctors = async (specialtyId) => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`http://localhost:5000/api/doctors/specialty/${specialtyId}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       setDoctors(response.data);
//     } catch (error) {
//       console.error('Error fetching doctors:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDoctorSelect = (doctor) => {
//     setSelectedDoctor(doctor);
//     setSelectedDate(null);
//     setAvailableTimeSlots([]);
//   };

//   const handleDateSelect = (date) => {
//     setSelectedDate(date);
//     const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' });
//     const availableDay = selectedDoctor.availableTimeSlots.find(day => day.day === dayOfWeek);
//     setAvailableTimeSlots(availableDay ? availableDay.slots : []);
//   };

//   const handleAppointment = (timeSlot) => {
//     navigate(`/appointments/${selectedDoctor._id}`, { 
//       state: { 
//         doctorId: selectedDoctor._id, 
//         date: selectedDate, 
//         timeSlot: timeSlot 
//       } 
//     });
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Find a Doctor</h1>
//       <Select onValueChange={setSelectedSpecialty}>
//         <SelectTrigger className="w-[280px] mb-4">
//           <SelectValue placeholder="Select a specialty" />
//         </SelectTrigger>
//         <SelectContent>
//           {specialties.map((specialty) => (
//             <SelectItem key={specialty._id} value={specialty._id}>
//               {specialty.name}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           {doctors.map((doctor) => (
//             <Card key={doctor._id} className="mb-4 cursor-pointer" onClick={() => handleDoctorSelect(doctor)}>
//               <CardContent className="flex p-4">
//                 <div className="w-1/3">
//                   <Avatar className="w-full h-auto aspect-square">
//                     <AvatarImage src={doctor.photoPath} alt={`${doctor.user.firstName} ${doctor.user.lastName}`} />
//                     <AvatarFallback>{`${doctor.user.firstName[0]}${doctor.user.lastName[0]}`}</AvatarFallback>
//                   </Avatar>
//                 </div>
//                 <div className="w-2/3 pl-4">
//                   <h2 className="text-xl font-bold">{`${doctor.user.firstName} ${doctor.user.lastName}`}</h2>
//                   <p><strong>Email:</strong> {doctor.user.email}</p>
//                   <p><strong>Phone:</strong> {doctor.phoneNumber}</p>
//                   <p><strong>Specialty:</strong> {specialties.find((spec) => spec._id === doctor.specialty).name}</p>
//                   <p><strong>Experience:</strong> {doctor.experience} years</p>
//                   <p><strong>Status:</strong> {doctor.available ? 'Available' : 'Not Available'}</p>
//                   <p><strong>Description:</strong> {doctor.description}</p>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//         {selectedDoctor && (
//           <div>
//             <h2 className="text-xl font-bold mb-4">Book an Appointment</h2>
//             <Calendar
//               mode="single"
//               selected={selectedDate}
//               onSelect={handleDateSelect}
//               className="mb-4"
//             />
//             {selectedDate && (
//               <div>
//                 <h3 className="text-lg font-semibold mb-2">Available Time Slots</h3>
//                 <div className="grid grid-cols-3 gap-2">
//                   {availableTimeSlots.map((slot, index) => (
//                     <Button key={index} onClick={() => handleAppointment(slot)}>
//                       {slot}
//                     </Button>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Doctor;