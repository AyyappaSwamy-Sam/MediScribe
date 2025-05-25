import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Calendar } from 'lucide-react';

const AdminUserActivity = () => {
  const [doctors, setDoctors] = useState([
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      phone: "+1 (555) 123-4567",
      email: "sarah.johnson@example.com",
      lastLoginDate: "2024-03-02",
      lastLoginTime: "14:30:25"
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      phone: "+1 (555) 234-5678",
      email: "michael.chen@example.com",
      lastLoginDate: "2024-03-02",
      lastLoginTime: "12:15:40"
    },
    {
      id: 3,
      name: "Dr. Emily Roberts",
      phone: "+1 (555) 345-6789",
      email: "emily.roberts@example.com",
      lastLoginDate: "2024-03-01",
      lastLoginTime: "16:45:12"
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      phone: "+1 (555) 456-7890",
      email: "james.wilson@example.com",
      lastLoginDate: "2024-03-01",
      lastLoginTime: "09:20:33"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // Filter doctors based on search term and selected date
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = 
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.phone.includes(searchTerm);

    const matchesDate = 
      !selectedDate || doctor.lastLoginDate === selectedDate;

    return matchesSearch && matchesDate;
  });

  // Format date and time for better display
  const formatDateTime = (date, time) => {
    const formattedDate = new Date(`${date} ${time}`).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    return formattedDate;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Card className="mx-auto max-w-6xl">
        <CardHeader>
          <CardTitle>Doctor Login Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Section */}
          <div className="flex flex-wrap gap-4 mb-6">
            {/* Text Search */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by name, email, or phone..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Date Filter */}
            <div className="relative min-w-[200px]">
              <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="date"
                className="pl-8"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                placeholder="Filter by date"
              />
            </div>
          </div>

          {/* Activity Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Last Login</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDoctors.map((doctor) => (
                  <TableRow key={doctor.id}>
                    <TableCell className="font-medium">
                      {doctor.name}
                    </TableCell>
                    <TableCell>{doctor.phone}</TableCell>
                    <TableCell>{doctor.email}</TableCell>
                    <TableCell>
                      {formatDateTime(doctor.lastLoginDate, doctor.lastLoginTime)}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredDoctors.length === 0 && (
                  <TableRow>
                    <TableCell 
                      colSpan={4} 
                      className="h-24 text-center text-gray-500"
                    >
                      No doctors found matching your search criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Results Summary */}
          <div className="mt-4 text-sm text-gray-500">
            Showing {filteredDoctors.length} of {doctors.length} doctors
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserActivity;