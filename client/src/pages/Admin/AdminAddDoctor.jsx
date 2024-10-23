import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Upload, Check, Calendar, X, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_SLOTS = [30, 45, 60];

const AdminAddDoctor = () => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [workingHours, setWorkingHours] = useState([]);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    licenseNumber: '',
    experience: '',
    specialty: '',
    education: '',
    selectedTimeSlot: null,
    workingHours: []
  });

  // Generate time slots based on interval
  const generateTimeSlots = (interval) => {
    const slots = [];
    let startTime = new Date();
    startTime.setHours(9, 0, 0); // Start at 9 AM
    let endTime = new Date();
    endTime.setHours(17, 0, 0); // End at 5 PM

    while (startTime < endTime) {
      const timeString = startTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
      slots.push(timeString);
      startTime.setMinutes(startTime.getMinutes() + interval);
    }
    return slots;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({
          ...prev,
          image: 'Image size should be less than 5MB'
        }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setErrors(prev => ({
          ...prev,
          image: ''
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDayToggle = (day) => {
    const updatedDays = selectedDays.includes(day)
      ? selectedDays.filter(d => d !== day)
      : [...selectedDays, day];
    setSelectedDays(updatedDays);
    if (errors.days && updatedDays.length > 0) {
      setErrors(prev => ({ ...prev, days: '' }));
    }
  };

  const handleTimeSlotSelect = (slot) => {
    setSelectedTimeSlot(slot);
    setWorkingHours([]);
    setShowTimeSlots(true);
  };

  const handleWorkingHourSelect = (time) => {
    const updatedHours = workingHours.includes(time)
      ? workingHours.filter(t => t !== time)
      : [...workingHours, time];
    setWorkingHours(updatedHours);
    if (errors.workingHours && updatedHours.length > 0) {
      setErrors(prev => ({ ...prev, workingHours: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) newErrors.phone = 'Invalid phone format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'License number is required';
    if (!formData.experience) newErrors.experience = 'Experience is required';
    if (!formData.specialty) newErrors.specialty = 'Specialty is required';
    if (!formData.education.trim()) newErrors.education = 'Education is required';
    if (!imagePreview) newErrors.image = 'Profile photo is required';
    if (selectedDays.length === 0) newErrors.days = 'Please select available days';
    if (!selectedTimeSlot) newErrors.timeSlot = 'Please select a time slot duration';
    if (workingHours.length === 0) newErrors.workingHours = 'Please select working hours';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate('/admin/doctors');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm">
        <Link to="/admin-dashboard/" className="text-gray-500 hover:text-gray-700">
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4 text-gray-500" />
        <Link to="/admin-doctors/" className="text-gray-500 hover:text-gray-700">
          Doctors
        </Link>
        <ChevronRight className="h-4 w-4 text-gray-500" />
        <span className="text-gray-900">Add Doctor</span>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl rounded-xl bg-white p-6 shadow-sm">
        <h1 className="mb-8 text-2xl font-semibold text-gray-900">Add Doctor</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Doctor Picture Upload */}
              <div className="flex flex-col items-center rounded-lg bg-gray-50 p-6">
                <div className="relative mb-4 h-32 w-32 overflow-hidden rounded-full bg-white shadow-sm">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Upload className="h-12 w-12 text-gray-300" />
                    </div>
                  )}
                </div>
                <label className="cursor-pointer rounded-md bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-sm hover:text-blue-700">
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
                {errors.image && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>{errors.image}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Doctor Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    placeholder="Enter full name"
                  />
                  {errors.name && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertDescription>{errors.name}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    placeholder="doctor@example.com"
                  />
                  {errors.email && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertDescription>{errors.email}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    placeholder="+1 (555) 000-0000"
                  />
                  {errors.phone && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertDescription>{errors.phone}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertDescription>{errors.password}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">License Number *</label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.licenseNumber ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  placeholder="Enter license number"
                />
                {errors.licenseNumber && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>{errors.licenseNumber}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Experience (years) *</label>
                <select 
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.experience ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                >
                  <option value="">Select experience</option>
                  {[...Array(50)].map((_, i) => (
                    <option key={i} value={i + 1}>{i + 1} years</option>
                  ))}
                </select>
                {errors.experience && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>{errors.experience}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Specialty *</label>
                <select 
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.specialty ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                >
                  <option value="">Select specialty</option>
                  <option value="general">General Physician</option>
                  <option value="cardio">Cardiologist</option>
                  <option value="derma">Dermatologist</option>
                  <option value="neuro">Neurologist</option>
                  <option value="ortho">Orthopedic</option>
                </select>
                {errors.specialty && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>{errors.specialty}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div>
              <label className="block text-sm font-medium text-gray-700">Education *</label>
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.education ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  placeholder="Educational qualifications"
                />
                {errors.education && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>{errors.education}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Time Slot Duration *</label>
                <div className="mt-2 grid grid-cols-3 gap-4">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => handleTimeSlotSelect(slot)}
                      className={`flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium ${
                        selectedTimeSlot === slot
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-300'
                      } hover:bg-blue-50`}
                    >
                      {slot} minutes
                    </button>
                  ))}
                </div>
                {errors.timeSlot && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>{errors.timeSlot}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Available Days *</label>
                <div className="relative mt-1">
                  <button
                    type="button"
                    onClick={() => setShowSchedule(!showSchedule)}
                    className={`flex w-full items-center justify-between rounded-md border ${
                      errors.days ? 'border-red-500' : 'border-gray-300'
                    } bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  >
                    <span className="block truncate text-gray-700">
                      {selectedDays.length ? selectedDays.join(', ') : 'Select available days'}
                    </span>
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </button>

                  {showSchedule && (
                    <div className="absolute right-0 z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                      <div className="flex items-center justify-between border-b px-4 py-2">
                        <span className="text-sm font-medium text-gray-700">Select Days</span>
                        <button
                          type="button"
                          onClick={() => setShowSchedule(false)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {DAYS.map((day) => (
                          <label
                            key={day}
                            className="flex cursor-pointer items-center border-b px-4 py-2 last:border-b-0 hover:bg-gray-50"
                          >
                            <input
                              type="checkbox"
                              checked={selectedDays.includes(day)}
                              onChange={() => handleDayToggle(day)}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-3 text-sm text-gray-700">{day}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {errors.days && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>{errors.days}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Working Hours Selection */}
              {selectedTimeSlot && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Working Hours *</label>
                  <div className="mt-2 grid max-h-48 grid-cols-3 gap-2 overflow-y-auto rounded-md border border-gray-200 p-2">
                    {generateTimeSlots(selectedTimeSlot).map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => handleWorkingHourSelect(time)}
                        className={`rounded px-3 py-1 text-sm ${
                          workingHours.includes(time)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  {errors.workingHours && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertDescription>{errors.workingHours}</AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-8 py-2 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Doctor
            </button>
          </div>
        </form>
      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center rounded-md bg-green-500 px-6 py-3 text-white shadow-lg">
          <Check className="mr-2 h-5 w-5" />
          Successfully added doctor
        </div>
      )}
    </div>
  );
};

export default AdminAddDoctor;