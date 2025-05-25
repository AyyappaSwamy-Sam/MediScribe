import React, { useState, useEffect } from 'react';
import { Check, Plus, Trash2, Search } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const AdminSpecialties = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [specialtyName, setSpecialtyName] = useState('');
  const [description, setDescription] = useState('');
  const [searchCondition, setSearchCondition] = useState('');
  const [conditions, setConditions] = useState([]);
  const [newCondition, setNewCondition] = useState('');
  const [errors, setErrors] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [specialties, setSpecialties] = useState([]);

  // Common medical conditions suggestion list
  const suggestedConditions = [
    'Hypertension', 'Diabetes', 'Asthma', 'Arthritis', 
    'Depression', 'Anxiety', 'Heart Disease', 'Migraine',
    'Back Pain', 'Allergies', 'Thyroid Disorders'
  ].filter(condition => 
    condition.toLowerCase().includes(searchCondition.toLowerCase()) &&
    !conditions.includes(condition)
  );

  // Fetch specialties on component mount
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/specialties');
        if (response.ok) {
          const data = await response.json();
          setSpecialties(data);
        } else {
          throw new Error('Failed to fetch specialties');
        }
      } catch (error) {
        console.error('Error fetching specialties:', error.message);
        showToastMessage('Error fetching specialties');
      }
    };
    fetchSpecialties();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!specialtyName.trim()) {
      newErrors.specialtyName = 'Specialty name is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (conditions.length === 0) {
      newErrors.conditions = 'At least one condition must be added';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCondition = (condition) => {
    if (condition.trim() && !conditions.includes(condition)) {
      setConditions([...conditions, condition]);
      setNewCondition('');
      setSearchCondition('');
      if (errors.conditions) {
        setErrors({ ...errors, conditions: '' });
      }
    }
  };

  const handleRemoveCondition = (indexToRemove) => {
    setConditions(conditions.filter((_, index) => index !== indexToRemove));
  };

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const newSpecialty = {
        name: specialtyName,
        description,
        conditions
      };
      
      try {
        const response = await fetch('http://localhost:5000/api/admin/add-specialty', {
          method: 'POST',
          headers: {
        'Content-Type': 'application/json'
          },
          body: JSON.stringify(newSpecialty)
        });
        
        if (response.status === 400) {
          showToastMessage('Specialty already exists');
          return;
        }
        
        if (response.status === 201) {
          const data = await response.json();
          showToastMessage('Specialty created successfully');
          
          // Add new specialty to state
          setSpecialties([...specialties, data.specialty]);
          
          // Reset form fields
          setSpecialtyName('');
          setDescription('');
          setConditions([]);
          setShowAddForm(false);
          return;
        }
        
        if (!response.ok) {
          throw new Error('Failed to add specialty');
        }
      } catch (error) {
        console.error('Error adding specialty:', error.message);
        showToastMessage('Error adding specialty');
      }
      
      }
    }

    const handleDeleteSpecialty = async (id) => {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/delete-specialty/${id}`, {
          method: 'DELETE'
        });
  
        if (response.ok) {
          // Remove the deleted specialty from the state
          setSpecialties(specialties.filter((specialty) => specialty.id !== id));
          showToastMessage('Specialty deleted successfully');
        } else {
          throw new Error('Failed to delete specialty');
        }
      } catch (error) {
        console.error('Error deleting specialty:', error.message);
        showToastMessage('Error deleting specialty');
      }
    };
  


  

  return (
    <div className="space-y-6">
      {/* Current Specialties List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Medical Specialties</CardTitle>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" /> Add New Specialty
          </button>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {specialties.map((specialty) => (
              <div key={specialty.id} className="py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{specialty.name}</h3>
                    <p className="mt-1 text-gray-600">{specialty.description || 'No description provided'}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(specialty.conditions || []).map((condition, index) => (
                        <span
                          key={`${specialty.id}-${index}`}
                          className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                        >
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteSpecialty(specialty._id)}
                    className="ml-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Specialty Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Medical Specialty</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Specialty Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Specialty Name *
                </label>
                <input
                  type="text"
                  value={specialtyName}
                  onChange={(e) => setSpecialtyName(e.target.value)}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.specialtyName ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  placeholder="e.g., Cardiology, Dermatology"
                />
                {errors.specialtyName && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>{errors.specialtyName}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  placeholder="Describe the specialty and its primary focus..."
                />
                {errors.description && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>{errors.description}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Related Conditions */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Related Conditions/Illnesses *
                </label>
                <div className="mt-1 space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={searchCondition}
                        onChange={(e) => setSearchCondition(e.target.value)}
                        className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Search conditions..."
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddCondition(searchCondition)}
                      className="flex items-center gap-1 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4" /> Add
                    </button>
                  </div>

                  {/* Suggestions */}
                  {searchCondition && suggestedConditions.length > 0 && (
                    <div className="max-h-48 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-sm">
                      {suggestedConditions.map((condition) => (
                        <button
                          key={condition}
                          type="button"
                          onClick={() => handleAddCondition(condition)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50"
                        >
                          {condition}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Added Conditions */}
                  <div className="flex flex-wrap gap-2">
                    {conditions.map((condition, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                      >
                        {condition}
                        <button
                          type="button"
                          onClick={() => handleRemoveCondition(index)}
                          className="ml-1 rounded-full p-1 hover:bg-blue-200"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  {errors.conditions && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertDescription>{errors.conditions}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="rounded-md border border-gray-300 px-8 py-2 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-8 py-2 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Add Specialty
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center rounded-md bg-green-500 px-6 py-3 text-white shadow-lg">
          <Check className="mr-2 h-5 w-5" />
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default AdminSpecialties;