import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import axios from 'axios';

const FeedbackNotifications = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get('/api/feedback');
        const data = Array.isArray(response.data) ? response.data : [];
        setFeedbackData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching feedback:', error);
        setError(error.message);
        setFeedbackData([]);
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  // Format date to display only the date part
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Format time to display in 12-hour format with AM/PM
  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const filteredFeedback = Array.isArray(feedbackData) 
    ? feedbackData.filter(feedback =>
        feedback?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback?.message?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="space-y-6">
          <CardTitle className="text-2xl font-bold text-[#1a2456]">Contact Us</CardTitle>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search by name, email or feedback..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading feedback data...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">Error: {error}</div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-48 ">Name</TableHead>
                    <TableHead className="w-48">Email</TableHead>
                    <TableHead className="w-88">Feedback</TableHead>
                    <TableHead className="w-32">Date</TableHead>
                    <TableHead className="w-32">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFeedback.length > 0 ? (
                    filteredFeedback.map((feedback, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell>{feedback.fullName || 'N/A'}</TableCell>
                        <TableCell>{feedback.email || 'N/A'}</TableCell>
                        <TableCell className="max-w-md overflow-hidden text-ellipsis">
                          {feedback.message || 'N/A'}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatDate(feedback.createdAt)}  
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatTime(feedback.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        No feedback records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackNotifications;