import React, { useState } from 'react';
import axios from 'axios';
import { Alert, AlertTitle, AlertDescription } from '../../components/ui/alert';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { MapPin, Mail, Phone } from 'lucide-react';
import { assets } from '../../assets/assets_frontend/assets';

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
      setFormData({ fullName: '', email: '', message: '' });
      setShowSuccessAlert(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setIsSubmitting(false);
      setShowErrorAlert(true);
    }
  };

  return (
    <div className=" from-blue-50 to-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">Get in Touch</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about MediScribe? We're here to help you with anything you need.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Image and Contact Info */}
          <div className="space-y-8">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1666214280557-f1b5022eb634?q=80&w=1200&auto=format&fit=crop"
                alt="Healthcare Communication"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent" />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
              <Card className="bg-white/80 backdrop-blur">
                <CardContent className="p-6 flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600">xxxxxxxxxx</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur">
                <CardContent className="p-6 flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">example@gmail.com</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur sm:col-span-2 lg:col-span-1 xl:col-span-2">
                <CardContent className="p-6 flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Location</h3>
                    <p className="text-gray-600">Kollam, Kerala - 690525</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div>
            <Card className="bg-white/80 backdrop-blur shadow-xl">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <Input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-white/50 backdrop-blur border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-white/50 backdrop-blur border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-white/50 backdrop-blur border-gray-200 focus:border-blue-500 focus:ring-blue-500 min-h-[150px]"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>

                {showSuccessAlert && (
                  <Alert variant="success" className="mt-4 bg-green-50 border-green-200">
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>Your message has been sent successfully.</AlertDescription>
                  </Alert>
                )}

                {showErrorAlert && (
                  <Alert variant="error" className="mt-4 bg-red-50 border-red-200">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      There was an error sending your message. Please try again later.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;