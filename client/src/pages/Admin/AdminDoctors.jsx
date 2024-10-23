import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MoreVertical, Plus, Edit, Trash } from 'lucide-react';

const AdminDoctors = () => {
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState(null);
  
  const handleAddDoctor = () => {
    navigate('/Admin-Add-Doctor/');
  };

  const handleEdit = (doctorId) => {
    navigate(`/admin/edit-doctor/${doctorId}`);
    setOpenMenuId(null);
  };

  const handleDelete = (doctorId) => {
    // Add your delete logic here
    console.log('Delete doctor:', doctorId);
    setOpenMenuId(null);
  };

  const doctors = [
    {
      id: 1,
      name: "Hugo Lloris",
      createdAt: "12 May, 2021",
      phone: "+1 234 567 890",
      title: "Dr.",
      email: "hugolloris@gmail.com",
      avatar: "/api/placeholder/32/32"
    },
    {
      id: 2,
      name: "Mauris auctor",
      createdAt: "12 May, 2021",
      phone: "+1 456 789 123",
      title: "Dr.",
      email: "maurisauctor@gmail.com",
      avatar: "/api/placeholder/32/32"
    },
    {
      id: 3,
      name: "Michael Owen",
      createdAt: "12 May, 2021",
      phone: "+1 890 123 456",
      title: "Dr.",
      email: "michaelowen@gmail.com",
      avatar: "/api/placeholder/32/32"
    },
    {
      id: 4,
      name: "Amina Smith",
      createdAt: "12 May, 2021",
      phone: "+1 908 765 432",
      title: "Dr.",
      email: "aminasmith@gmail.com",
      avatar: "/api/placeholder/32/32"
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-6">Doctors</h1>
        <div className="flex justify-between items-center">
          <div className="relative w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search 'daudi mburuge'"
              className="w-full pl-8 pr-4 py-2 border rounded-md"
            />
          </div>
          <button 
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
            onClick={handleAddDoctor}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Doctor
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4 w-12">#</th>
              <th className="text-left p-4">Doctor</th>
              <th className="text-left p-4">Created At</th>
              <th className="text-left p-4">Phone</th>
              <th className="text-left p-4">Title</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4 w-12">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor.id} className="border-b">
                <td className="p-4">{doctor.id}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <img
                      src={doctor.avatar}
                      alt={doctor.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{doctor.name}</span>
                  </div>
                </td>
                <td className="p-4">{doctor.createdAt}</td>
                <td className="p-4">{doctor.phone}</td>
                <td className="p-4">{doctor.title}</td>
                <td className="p-4">{doctor.email}</td>
                <td className="p-4 relative">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === doctor.id ? null : doctor.id)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                  {openMenuId === doctor.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                      <div className="py-1">
                        <button
                          onClick={() => handleEdit(doctor.id)}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(doctor.id)}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDoctors;