import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MoreVertical, Plus, Edit, Trash, ChevronDown } from 'lucide-react';
import { assets } from '../../assets/assets_frontend/assets';

const AdminDoctors = () => {
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState(null);
  const [nameSearch, setNameSearch] = useState('');
  const [specialtySearch, setSpecialtySearch] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch specialties from the backend
    fetch('http://localhost:5000/api/admin/specialties')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setSpecialties(data.map(item => item.name).sort()))
      .catch(error => {
        console.error('Error fetching specialties:', error);
        setError('Error fetching specialties');
      });

    // Fetch doctors list from the backend
    fetch('http://localhost:5000/api/admin/doctors-list')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setDoctors(data || []))
      .catch(error => {
        console.error('Error fetching doctors:', error);
        setError('Error fetching doctors');
      });
  }, []);

  const handleAddDoctor = () => {
    navigate('/Admin-Add-Doctor/');
  };

  const handleEdit = (doctorId) => {
    navigate(`/admin-edit-doctor/${doctorId}`);
    setOpenMenuId(null);
  };

  const handleDelete = (doctorId) => {
    setDoctors(prevDoctors => prevDoctors.filter(doctor => doctor.id !== doctorId));
    setOpenMenuId(null);
  };

  // Filter doctors based on search inputs
  const filteredDoctors = doctors.filter(doctor => {
    const nameMatch = doctor.name.toLowerCase().includes(nameSearch.toLowerCase());
    const specialtyMatch = specialtySearch === '' || doctor.specality === specialtySearch;
    return nameMatch && specialtyMatch;
  });

  return (
    <div className="p-6">
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-6">Doctors</h1>
        <div className="flex justify-between items-center gap-4">
          <div className="flex gap-4 flex-1">
            <div className="relative w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name"
                value={nameSearch}
                onChange={(e) => setNameSearch(e.target.value)}
                className="w-full pl-8 pr-4 py-2 border rounded-md"
              />
            </div>
            <div className="relative w-72">
              <select
                value={specialtySearch}
                onChange={(e) => setSpecialtySearch(e.target.value)}
                className="w-full px-4 py-2 border rounded-md appearance-none pr-10 bg-white"
              >
                <option value="">All Specialties</option>
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <button 
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center whitespace-nowrap"
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
              
              <th className="text-left p-4">Doctor</th>
              <th className="text-left p-4">Phone</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Specality</th>
              <th className="text-left p-4">Availability</th>
              <th className="text-left p-4 w-12">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.map((doctor) => (
              <tr key={doctor.id} className="border-b">
                
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
                <td className="p-4">{doctor.phoneNumber}</td>
                <td className="p-4">{doctor.email}</td>
                <td className="p-4">{doctor.specality}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    doctor.available 
                      ? 'text-green-700 bg-green-100' 
                      : 'text-red-700 bg-red-100'
                  }`}>
                    {doctor.available ? 'Available' : 'Not Available'}
                  </span>
                </td>
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