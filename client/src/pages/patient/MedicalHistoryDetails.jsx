import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Clock, FileAudio, List, AlertCircle } from 'lucide-react';

const MedicalHistoryDetails = () => {
  const [historyDetails, setHistoryDetails] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    const userId = localStorage.getItem('id1');

    if (!user || user !== 'patient') {
      navigate('/auth');
      return;
    }

    const fetchHistoryDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/patient/medical-history/details/${id}`);
        console.log(response);
        if (response.status !== 200) {
          throw new Error('Failed to fetch history details');
        }
        const data = await response.json();
        setHistoryDetails(data);
      } catch (error) {
        console.error('Error fetching history details:', error);
      }
    };

    fetchHistoryDetails();
  }, [id, navigate]);

  const calculateTimeSpent = (start, end) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffInMinutes = Math.round((endTime - startTime) / 60000);
    return `${diffInMinutes} minutes`;
  };

  if (!historyDetails) return <div className="text-center mt-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation Section */}
      <nav className="flex space-x-4 items-center p-4 bg-white-100 mb-6">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? ' underline' : 'hover:underline text-gray-600'
          }
        >
          Home
        </NavLink>

        {/* Arrow between links */}
        <span className="text-gray-500">→</span>

        <NavLink
          to="/medical-history"
          className={({ isActive }) =>
            isActive ? '' : 'hover:underline text-gray-600'
          }
        >
          History
        </NavLink>
        {/* Arrow between links */}
        <span className="text-gray-500">→</span>

        <NavLink
          className={({ isActive }) =>
            isActive ? 'font-bold underline' : 'hover:underline text-gray-600'
          }
        >
          Medical History Details
        </NavLink>
      </nav>

      <h1 className="text-3xl font-bold mb-6">Medical History Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <AlertCircle className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Summary</h2>
          </CardHeader>
          <CardContent>
            <p>{historyDetails.summary}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <List className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Details</h2>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li><strong>Symptoms:</strong> {historyDetails.details.symptoms}</li>
              <li><strong>Medicines:</strong> {historyDetails.details.medicines}</li>
              <li><strong>Food to Eat:</strong> {historyDetails.details.FoodToEat}</li>
              <li><strong>Food to Avoid:</strong> {historyDetails.details.FoodToAvoid}</li>
              <li><strong>Notes:</strong> {historyDetails.details.notes}</li>
              <li><strong>Disease:</strong> {historyDetails.details.disease}</li>
              <li><strong>Tasks:</strong> {historyDetails.details.tasks}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Clock className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Session Information</h2>
          </CardHeader>
          <CardContent>
            <p><strong>Time Spent:</strong> {calculateTimeSpent(historyDetails.recordingStartedAt, historyDetails.pushedToEMRAt)}</p>
            <p><strong>Recording Started:</strong> {new Date(historyDetails.recordingStartedAt).toLocaleString()}</p>
            <p><strong>EMR System:</strong> {historyDetails.emrSystem}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <FileAudio className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Audio Recording</h2>
          </CardHeader>
          <CardContent>
            <audio controls className="w-full">
              <source src={`http://localhost:5000/${historyDetails.audioFilePath}`} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MedicalHistoryDetails;
