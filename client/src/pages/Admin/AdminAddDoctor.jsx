import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Camera, Check } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";


const AddDoctor = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    licenseNumber: '',
    experience: '',
    specialty: '',
    description: '',
    education: '',
    gender: '',
    availableDays: [],
    availableTimeSlots: [],
    photo: null
  });
  const { toast } = useToast();
  const [specialties, setSpecialties] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const [passwordError, setPasswordError] = useState('');


  useEffect(() => {
    fetchSpecialties();
    generateTimeSlots();
  }, []);

  const fetchSpecialties = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/specialties');
      setSpecialties(response.data);
    } catch (error) {
      console.error('Error fetching specialties:', error);
    }
  };

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }
  )
);


    
    
  };

 

  // const uploadToDropbox = async (file) => {
  //   try {
  //     console.log('start')

  //     const dropboxResponse = await axios.post('http://localhost:5000/api/admin/dropbox/upload', file);
  //     console.log(dropboxResponse.data.url)
  //     return dropboxResponse.data.url;
  //   } catch (error) {
  //     console.error('Error uploading to Dropbox:', error);
  //     return '';
  //   }
  // };



  const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day]
    }));
  };



  const handleTimeSlotToggle = (slot) => {
    setFormData(prev => ({
      ...prev,
      availableTimeSlots: prev.availableTimeSlots.includes(slot)
        ? prev.availableTimeSlots.filter(s => s !== slot)
        : [...prev.availableTimeSlots, slot]
    }));
  };


  const handleSelectAllDays = () => {
    setFormData(prev => ({
      ...prev,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }));
  };

  const generateTimeSlots = () => {
    const timeSlots = [];
    for (let hour = 9; hour < 18; hour++) {
      const amPm = hour < 12 ? 'AM' : 'PM';
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
      timeSlots.push(`${formattedHour}:00 ${amPm}`);
      timeSlots.push(`${formattedHour}:30 ${amPm}`);
    }
    setAvailableTimeSlots(timeSlots);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photo: file
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        setPasswordError('Password and Confirm Password do not match');
      } else {
        setPasswordError('');
      }

      const formDataToSend = new FormData();
      for (const [key, value] of Object.entries(formData)) {
        if (value !== null) {
          formDataToSend.append(key, value);
        }
      }

      console.log(formDataToSend);
      console.log('Sending form data:', Object.fromEntries(formDataToSend));
      const response = await axios.post('http://localhost:5000/api/admin/add-doctor', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 201) {
        
        toast({
          title: "Success",
          description: "Doctor created successfully",
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
      }

      // Reset form after successful submission
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        licenseNumber: '',
        experience: '',
        specialty: '',
        description: '',
        education: '',
        gender: '',
        availableDays: [],
        availableTimeSlots: [],
        photo: ''
      });

      // alert('Doctor added successfully!');
    } catch (error) {
      console.error('Error adding doctor:', error);
      alert('Error adding doctor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-6">
      <Toaster />
      <CardHeader>
        <CardTitle>Add Doctor</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col space-y-4">
            {/* Photo Upload */}
            <div className="flex flex-col items-center p-4 border-2 border-dashed rounded-lg">
              <Label>Upload Photo</Label>
              <div className="mt-2 flex items-center justify-center w-24 h-24 rounded-full bg-gray-100">
                <Camera size={36} />
              </div>
              <Input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="mt-2"
              />
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>First Name *</Label>
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label>Last Name *</Label>
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

           
            {/* Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Password *</Label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label>Confirm Password *</Label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            


            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label>Phone Number *</Label>
                <Input
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Professional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Specialty *</Label>
                <Select
                  name="specialty"
                  value={formData.specialty}
                  onValueChange={(value) => handleInputChange({ target: { name: 'specialty', value }})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map((specialty) => (
                      <SelectItem key={specialty._id} value={specialty._id}>
                        {specialty.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>License Number *</Label>
                <Input
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Description & Education */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Description</Label>
                <Input
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label>Education</Label>
                <Input
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <Label>Gender</Label>
              <Select
                name="gender"
                value={formData.gender}
                onValueChange={(value) => handleInputChange({ target: { name: 'gender', value }})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>

            </div>
            {/* Experience */}
            <div>
              <Label>Experience (Years)</Label>
              <Select
                name="experience"
                value={formData.experience}
                onValueChange={(value) => handleInputChange({ target: { name: 'experience', value }})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 81 }, (_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Available Days */}
            <div>
              <Label>Available Days</Label>
              <div className="flex items-center justify-between mt-2">
                <div className="grid grid-cols-7 gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={day}
                        checked={formData.availableDays.includes(day)}
                        onCheckedChange={() => handleDayToggle(day)}
                      />
                      <Label htmlFor={day}>{day}</Label>
                    </div>
                  ))}

                </div>
                <Button type="button" variant="outline" onClick={handleSelectAllDays}>
                  Select All
                </Button>
              </div>
            </div>

            {/* Available Time Slots */}
            <div>
              <Label>Available Time Slots</Label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-2">
                {availableTimeSlots.map((timeSlot) => (
                  <Button
                    key={timeSlot}
                    type="button"
                    variant={formData.availableTimeSlots.includes(timeSlot) ? "default" : "outline"}
                    onClick={() => handleTimeSlotToggle(timeSlot)}
                    className="p-2"
                  >
                    {timeSlot}
                  </Button>
                ))}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Adding Doctor...' : 'Add Doctor'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddDoctor;