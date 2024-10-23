import React, { useState } from 'react';
import axios from 'axios';
import { Alert, AlertTitle, AlertDescription } from '../../components/ui/alert';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { assets } from '../../assets/assets_frontend/assets';
// import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('/api/feedback', formData);
      setIsSubmitting(false);
      setFormData({
        fullName: '',
        email: '',
        message: '',
      });
      setShowSuccessAlert(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setIsSubmitting(false);
      setShowErrorAlert(true);
    }
  };

  return (
    <div className="flex flex-col md:flex-row max-w-6xl mx-auto py-12 ">
      <div className="md:w-1/2 p-8">
        <img
          src={assets.contactimg}
          alt="Smartphone with business ideas"
          className="w-full h-auto rounded-lg object-cover"
        />
      </div>
      <div className="md:w-1/2 p-8">
        <h1 className="text-4xl font-serif text-[#1a2456] mb-8 underline">Contact Us</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            <Input
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              className="border-b border-gray-300 focus:border-[#1a2456] bg-transparent"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">E-mail</label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="border-b border-gray-300 focus:border-[#1a2456] bg-transparent"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Message</label>
            <Textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              className="border-b border-gray-300 focus:border-[#1a2456] bg-transparent"
            />
          </div>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-[#1a2456] text-white px-8 py-2 rounded-full hover:bg-[#2a3466] transition-colors"
          >
            Submit
          </Button>
        </form>

        {showSuccessAlert && (
          <Alert variant="success" className="mt-4">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Your message has been sent successfully.</AlertDescription>
          </Alert>
        )}

        {showErrorAlert && (
          <Alert variant="error" className="mt-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              There was an error sending your message. Please try again later.
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-12">
          <h2 className="text-lg font-semibold text-[#1a2456] mb-2">Contact</h2>
          <p className="text-gray-600">xxxxxxxxxx</p>
          <h2 className="text-lg font-semibold text-[#1a2456] mt-4 mb-2">Email</h2>
          <p className="text-gray-600">example@gmail.com</p>
          <h2 className="text-lg font-semibold text-[#1a2456] mb-2">Location</h2>
          <p className="text-gray-600">Kollam<br />Kerala - 690525</p>
          {/* <div className="flex space-x-4 mt-6">
            <a href="#" className="text-[#1a2456] hover:text-[#2a3466]"><FaFacebookF /></a>
            <a href="#" className="text-[#1a2456] hover:text-[#2a3466]"><FaInstagram /></a>
            <a href="#" className="text-[#1a2456] hover:text-[#2a3466]"><FaTwitter /></a>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Contact;