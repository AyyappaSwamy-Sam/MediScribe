import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { User, UserPlus, Stethoscope, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import backgroundImage from '../../assets/assets_frontend/background.jpg';

const Login = () => {
  const navigate = useNavigate();
  const { login, signup,  error, token } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState('patient');
  const toast = useToast()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    dob: { day: '', month: '', year: '' },
    gender: '',
    phoneNumber: '',
    emrSystem: ''
  });
  const [formErrors, setFormErrors] = useState(false);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let errors = {};

  if (name === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      errors.email = 'Please enter a valid email address';
    }
  }

  if (name === 'password' && value.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }
    setFormErrors(prev => ({
      ...prev,
      [name]: errors[name] || '',
    }));
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDobChange = (type, value) => {
    setFormData(prev => ({
      ...prev,
      dob: { ...prev.dob, [type]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = getEndpoint(); // Make sure this function is defined
    const submitData = { ...formData, userType: role };
    // console.log(submitData);

    try {
      let response;
      if (isSignUp) {
        response = await signup(submitData);
        if (response.status===201){
          console.log('Thank you for signing up!');
        }
        
        
      } else {
        response = await login(submitData);
        console.log(response)
        if (response.status ===200){
            console.log("Please Use correct credentials")
        }
      }


      console.log('frrr',response)
      if (response) {
        // Store the token in localStorage or in your auth context
        localStorage.setItem('token', response.token);
        localStorage.setItem('id1', response.patientID);
        
        toast({
            title: 'Account created.',
            description: "We've created your account for you.",
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
        switch (role) {
          case 'patient':
            navigate('/');
            break;
          case 'doctor':
            console.log('hi');
            navigate('/doctor-page');
            break;
          case 'admin':
            navigate('admin-dashboard');
            break;
          default:
            navigate('/');
        }
      } else {
        console.error('Authentication failed:', response.message);
      }
    } catch (err) {
      console.error('Authentication error:', err.message);
      if (error.response && error.response.status === 400) {
        // Error: Display the error message returned by the server
        console.log(error.response.data.message);
      }
      // You can set a local error state here if you want to display it in the component
    }
  };

  const getEndpoint = () => {
    switch (role) {
      case 'patient':
        return isSignUp ? '/api/patient/signup' : '/api/patient/signin';
      case 'doctor':
        return '/api/doctor/signin';
      case 'admin':
        return '/api/admin/signin';
      default:
        return '/api/signin';
    }
  };
  const handleRoleChange = (newRole) => {
    setRole(newRole);
    if (newRole !== 'patient') {
      setIsSignUp(false);
    }
  };
  const getWelcomeMessage = () => {
    
    switch (role) {
      case 'patient':
        if (isSignUp) return "Welcome, New User!";
        return "Welcome Back, Patient!";
      case 'doctor':
        return "Welcome, Doctor!";
      case 'admin':
        return "Welcome, Admin!";
      default:
        return "Welcome!";
    }
  };

  const handlePhoneNumberChange = (e) => {
    const { value } = e.target;
  
    // Allow only numeric values and restrict to 10 digits
    if (/^\d{0,10}$/.test(value)) {
      setFormData((prev) => ({
        ...prev,
        phoneNumber: value,
      }));
  
      // If the length is less than 10 digits, show an error
      if (value.length !== 10 && value.length > 0) {
        setFormErrors((prev) => ({
          ...prev,
          phoneNumber: 'Phone number must be exactly 10 digits.',
        }));
      } else {
        setFormErrors((prev) => ({
          ...prev,
          phoneNumber: '',
        }));
      }
    }
  };
  

  return (
    <div className='mt-20 flex gap-3 items-center justify-center min-h-screen  from-black-100 to-indigo-100'>
      
      <Card className="w-[500px] bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6">
          <CardTitle className="text-2xl font-bold text-center">{getWelcomeMessage()}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center space-x-4 mb-6">
              <Button
                type="button"
                variant={role === 'patient' ? 'default' : 'outline'}
                className={`flex-1 ${role === 'patient' ? 'bg-blue-500 text-white' : 'text-blue-500'}`}
                onClick={() => handleRoleChange('patient')}
              >
                <User className="mr-2 h-4 w-4" />
                Patient
              </Button>
              <Button
                type="button"
                variant={role === 'doctor' ? 'default' : 'outline'}
                className={`flex-1 ${role === 'doctor' ? 'bg-green-500 text-white' : 'text-green-500'}`}
                onClick={() => handleRoleChange('doctor')}
              >
                <Stethoscope className="mr-2 h-4 w-4" />
                Doctor
              </Button>
              <Button
                type="button"
                variant={role === 'admin' ? 'default' : 'outline'}
                className={`flex-1 ${role === 'admin' ? 'bg-purple-500 text-white' : 'text-purple-500'}`}
                onClick={() => handleRoleChange('admin')}
              >
                <ShieldCheck className="mr-2 h-4 w-4" />
                Admin
              </Button>
            </div>
            <div>
              
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full"
              />
              {formErrors.email && <p className="text-red-500">{formErrors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full"
              />
              {formErrors.password && <p className="text-red-500">{formErrors.password}</p>}
            </div>
            {isSignUp && role === 'patient' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="As per Aadhar"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="As per Aadhar"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {/* Day Dropdown */}
                    <Select name="day" onValueChange={(value) => handleDobChange('day', value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="DD" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 31 }, (_, i) => (
                          <SelectItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                            {String(i + 1).padStart(2, '0')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Month Dropdown */}
                    <Select name="month" onValueChange={(value) => handleDobChange('month', value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="MM" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => (
                          <SelectItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                            {String(i + 1).padStart(2, '0')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Year Dropdown */}
                    <Select name="year" onValueChange={(value) => handleDobChange('year', value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="YYYY" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: new Date().getFullYear() - 1960 + 1 }, (_, i) => {
                          const year = 1960 + i;
                          return (
                            <SelectItem key={year} value={String(year)}>
                              {year}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>


                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select name="gender" onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))} required>
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
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    placeholder="Enter phone number"
                    value={formData.phoneNumber}
                    onChange={handlePhoneNumberChange}
                    required
                  />
                  {formErrors.phoneNumber && <p className="text-red-500">{formErrors.phoneNumber}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emrSystem">EMR System</Label>
                  <Select name="emrSystem" onValueChange={(value) => setFormData(prev => ({ ...prev, emrSystem: value }))} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select EMR system" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system1">System 1</SelectItem>
                      <SelectItem value="system2">System 2</SelectItem>
                      <SelectItem value="system3">System 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 bg-gray-50 p-0">
        {role === 'patient' && (
  <>
    <p className="text-sm text-slate-600 text-center">
      {isSignUp ? "Already have an account?" : "Don't have an account?"}
      <Button
        variant="link"
        className="text-blue-600 hover:text-blue-800"
        onClick={() => setIsSignUp(!isSignUp)}
      >
        {isSignUp ? 'Sign In' : 'Sign Up'}
      </Button>
    </p>
  </>
)}

        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
