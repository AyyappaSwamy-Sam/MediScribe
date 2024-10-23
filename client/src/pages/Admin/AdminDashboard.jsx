import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Calendar, UserPlus, 
  ChevronUp, ChevronDown, ArrowRight 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('today');

  // Sample data - replace with real data
  const stats = [
    {
      title: "Total Doctors",
      value: "25+",
      icon: <Users className="h-4 w-4" />,
      change: 12,
      changeText: "from last month"
    },
    {
      title: "Today's Appointments",
      value: "15",
      icon: <Calendar className="h-4 w-4" />,
      change: 8,
      changeText: "from yesterday"
    },
    {
      title: "Total Patients",
      value: "1,600+",
      icon: <UserPlus className="h-4 w-4" />,
      change: 45.06,
      changeText: "from last month"
    }
  ];

  const appointmentsData = [
    { month: 'Jan', appointments: 30 },
    { month: 'Feb', appointments: 40 },
    { month: 'Mar', appointments: 35 },
    { month: 'Apr', appointments: 50 },
    { month: 'May', appointments: 45 },
    { month: 'Jun', appointments: 60 },
    { month: 'Jul', appointments: 65 },
    { month: 'Aug', appointments: 55 },
    { month: 'Sep', appointments: 50 },
    { month: 'Oct', appointments: 45 },
    { month: 'Nov', appointments: 40 },
    { month: 'Dec', appointments: 35 }
  ];

  const recentPatients = [
    { name: "Amina Smith", phone: "+1 908 765 432", time: "2:00 PM" },
    { name: "Minahil Khan", phone: "+1 890 123 456", time: "2:00 PM" },
    { name: "Alex Morgan", phone: "+1 908 765 432", time: "2:00 PM" },
    { name: "John Doe", phone: "+1 234 567 890", time: "2:00 PM" },
    { name: "David Beckham", phone: "+1 456 789 123", time: "2:00 PM" }
  ];

  const doctors = [
    { 
      name: "Dr. Sarah Johnson",
      phone: "+1 234 567 890",
      status: "Available",
      specialty: "Cardiologist"
    },
    { 
      name: "Dr. Michael Chen",
      phone: "+1 345 678 901",
      status: "Unavailable",
      specialty: "Pediatrician"
    },
    { 
      name: "Dr. Emily Brown",
      phone: "+1 456 789 012",
      status: "Available",
      specialty: "Dermatologist"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={`inline-flex items-center ${stat.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change > 0 ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  {Math.abs(stat.change)}%
                </span>
                {" "}{stat.changeText}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Appointments Graph */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Appointments Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={appointmentsData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="appointments" 
                    stroke="#8884d8" 
                    strokeWidth={2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Patients */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPatients.map((patient, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      {patient.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-gray-500">{patient.phone}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{patient.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Doctors List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Doctors</CardTitle>
          <Select
            value={timeRange}
            onValueChange={setTimeRange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {doctors.map((doctor, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    {doctor.name.split(' ')[1].charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{doctor.name}</p>
                    <p className="text-sm text-gray-500">{doctor.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    doctor.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {doctor.status}
                  </span>
                  <span className="text-sm text-gray-500">{doctor.specialty}</span>
                </div>
              </div>
            ))}
          </div>
          <Button 
            variant="link" 
            className="mt-4 w-full"
            onClick={() => navigate('/admin-doctors')}
          >
            More Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;