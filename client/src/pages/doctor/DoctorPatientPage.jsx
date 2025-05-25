


// import React, { useState, useRef, useEffect } from 'react';
// import { Upload, Mic, CheckCircle, AlertCircle, Play, Ban as Stop, Send, User, Clock, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
// import { useParams } from 'react-router-dom';

// const AudioRecorder = () => {
//   // Keep existing audio recording states
//   const [recording, setRecording] = useState(false);
//   const [mediaRecorder, setMediaRecorder] = useState(null);
//   const [audioChunks, setAudioChunks] = useState([]);
//   const [status, setStatus] = useState('idle');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [audioUrl, setAudioUrl] = useState('');
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [transcript, setTranscript] = useState('');
//   const [summary, setSummary] = useState('');
  
//   // New states for patient info
//   const [patientDetails, setPatientDetails] = useState(null);
//   const [patientHistory, setPatientHistory] = useState([]);
//   const [expandedHistory, setExpandedHistory] = useState(null);
//   const audioRef = useRef(null);
  
//   // Get appointment ID from URL
//   const { appointmentId } = useParams();

  

  

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const recorder = new MediaRecorder(stream);
//       setMediaRecorder(recorder);
//       setAudioChunks([]);

//       recorder.ondataavailable = (event) => {
//         setAudioChunks(current => [...current, event.data]);
//       };

//       recorder.onstop = () => {
//         stream.getTracks().forEach(track => track.stop());
//         const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
//         const url = URL.createObjectURL(audioBlob);
//         setAudioUrl(url);
//       };

//       recorder.start();
//       setRecording(true);
//       setStatus('recording');
//       setErrorMessage('');
//     } catch (err) {
//       setErrorMessage('Error accessing microphone. Please ensure microphone permissions are granted.');
//       setStatus('error');
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorder && recording) {
//       mediaRecorder.stop();
//       setRecording(false);
//       setStatus('idle');
//     }
//   };

//   const togglePlayback = () => {
//     if (audioRef.current) {
//       if (isPlaying) {
//         audioRef.current.pause();
//         audioRef.current.currentTime = 0;
//       } else {
//         audioRef.current.play();
//       }
//       setIsPlaying(!isPlaying);
//     }
//   };

//   const uploadRecording = async () => {
//     if (audioChunks.length === 0) return;

//     const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
//     const formData = new FormData();
//     formData.append('audio', audioBlob, 'recording.wav');
//     formData.append('patientId', patientDetails.patientId);

//     setStatus('uploading');
//     try {
//       const response = await fetch('http://localhost:5006/process-audio', {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Upload failed');
//       }

//       setTranscript(data.transcript);
//       setSummary(data.summary);
//       setStatus('processed');
//     } catch (err) {
//       setErrorMessage(err.message || 'Error processing audio');
//       setStatus('error');
//     }
//   };

//   const saveToDropbox = async () => {
//     const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
//     const formData = new FormData();
//     formData.append('audio', audioBlob, 'recording.wav');
//     formData.append('patientId', patientDetails.patientId);
//     formData.append('transcript', transcript);
//     formData.append('summary', summary);

//     setStatus('uploading');
//     try {
//       const response = await fetch('http://localhost:5006/save-to-dropbox', {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Save failed');
//       }

//       setStatus('success');
//       setAudioChunks([]);
//       setAudioUrl('');
//       setTranscript('');
//       setSummary('');
//     } catch (err) {
//       setErrorMessage(err.message || 'Error saving to Dropbox');
//       setStatus('error');
//     }
//   };
  
//   useEffect(() => {
//     fetchPatientDetails();
//     fetchPatientHistory();
//   }, [appointmentId]);

//   const fetchPatientDetails = async () => {
//     const token = localStorage.getItem('jwt');
//     try {
//       const response = await fetch(`http://localhost:5003/api/doctor/patientDetails/${appointmentId}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       if (response.status === 404) {
//         setErrorMessage('Patient not found');
//         return;
//       }
      
//       const data = await response.json();
//       if (data.success && data.patient) {
//         setPatientDetails(data.patient); // Set the patient object directly
//       } else {
//         setErrorMessage('Invalid patient data format');
//       }
//     } catch (err) {
//       setErrorMessage('Error fetching patient details');
//     }
//   };

//   const fetchPatientHistory = async () => {
//     const token = localStorage.getItem('jwt');
//     try {
//       const response = await fetch(`http://localhost:5003/api/doctor/patientInfo/${appointmentId}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       if (data.message === "No appointment records found for this patient") {
//         setPatientHistory([]);
//         return;
//       }
  
//       // If we have records, set them
//       if (data.records) {
//         setPatientHistory(data.records);
//       } else {
//         setPatientHistory([]);  // Fallback to empty array if records not found
//       }
//     } catch (err) {
//       setErrorMessage('Error fetching patient history');
//     }
//   };

//   // Keep all existing audio recording functions
//   // ... (startRecording, stopRecording, togglePlayback, uploadRecording, saveToDropbox)

//   return (
//     <div className="min-h-screen  p-4 md:p-8">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Patient Details Card */}
//         {patientDetails && (
//           <div className="bg-white rounded-xl shadow-lg p-6 animate-fadeIn">
//             <div className="flex flex-col md:flex-row md:items-center justify-between">
//               <div className="flex items-center space-x-4">
//                 <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
//                   <User className="h-8 w-8 text-blue-600" />
//                 </div>
//                 <div>
//                   <h1 className="text-2xl font-bold text-gray-900">
//                     {patientDetails.firstName} {patientDetails.lastName} 
//                   </h1>
//                   <p className="text-gray-600">{patientDetails.email}</p>
//                 </div>
//               </div>
//               <div className="mt-4 md:mt-0 grid grid-cols-2 md:grid-cols-3 gap-4">
//                 <div className="bg-gray-50 p-3 rounded-lg">
//                   <p className="text-sm text-gray-500">DOB</p>
//                   <p className="font-medium">{new Date(patientDetails.dob).toLocaleDateString()}</p>
//                 </div>
//                 <div className="bg-gray-50 p-3 rounded-lg">
//                   <p className="text-sm text-gray-500">Gender</p>
//                   <p className="font-medium">{patientDetails.gender}</p>
//                 </div>
//                 <div className="bg-gray-50 p-3 rounded-lg">
//                   <p className="text-sm text-gray-500">Phone</p>
//                   <p className="font-medium">{patientDetails.phoneNumber}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//     {patientDetails && (
//         <div className="text-center mb-6">
//         <h2 className="text-3xl font-bold text-gray-900 mb-2">Audio Recorder</h2>
//         <p className="text-gray-600">Patient ID:{patientDetails.patientId} </p>
//        </div>)}

//        <div className="space-y-4">
//          <button
//           onClick={recording ? stopRecording : startRecording}
//           className={`w-full py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
//             recording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
//           } text-white`}
//         >
//           <Mic className="w-5 h-5" />
//           <span>{recording ? 'Stop Recording' : 'Start Recording'}</span>
//         </button>

//         {audioUrl && (
//           <div className="mt-4">
//             <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />
//             <button
//               onClick={togglePlayback}
//               className="w-full py-3 px-4 rounded-lg bg-gray-500 hover:bg-gray-600 text-white flex items-center justify-center space-x-2"
//             >
//               {isPlaying ? <Stop className="w-5 h-5" /> : <Play className="w-5 h-5" />}
//               <span>{isPlaying ? 'Stop' : 'Play Recording'}</span>
//             </button>
//           </div>
//         )}

//         {audioUrl && status !== 'processed' && (
//           <button
//             onClick={uploadRecording}
//             disabled={status === 'uploading'}
//             className="w-full py-3 px-4 rounded-lg bg-green-500 hover:bg-green-600 text-white flex items-center justify-center space-x-2 disabled:opacity-50"
//           >
//             <Upload className="w-5 h-5" />
//             <span>{status === 'uploading' ? 'Processing...' : 'Process Recording'}</span>
//           </button>
//         )}

//         {transcript && (
//           <div className="space-y-4">
//             <div className="p-4 bg-white rounded-lg shadow-inner overflow-y-auto max-h-64">
//               <h3 className="font-semibold mb-2">Transcript:</h3>
//               <p className="text-gray-700 text-sm">{transcript}</p>
//             </div>
//             <div className="p-4 bg-white rounded-lg shadow-inner overflow-y-auto max-h-48">
//               <h3 className="font-semibold mb-2">Summary:</h3>
//               <p className="text-gray-700 text-sm">{summary}</p>
//             </div>
//           </div>
//         )}

//         {transcript && (
//           <button
//             onClick={saveToDropbox}
//             className="w-full py-3 px-4 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white flex items-center justify-center space-x-2"
//           >
//             <Send className="w-5 h-5" />
//             <span>Save in EMR</span>
//           </button>
//         )}

//         {status === 'success' && (
//           <div className="p-4 bg-green-100 text-green-700 rounded-lg flex items-center space-x-2">
//             <CheckCircle className="w-5 h-5" />
//             <span>Successfully saved the data</span>
//           </div>
//         )}

//         {status === 'error' && (
//           <div className="p-4 bg-red-100 text-red-700 rounded-lg flex items-center space-x-2">
//             <AlertCircle className="w-5 h-5" />
//             <span>{errorMessage}</span>
//           </div>
//         )}


//       </div>
//         {/* Keep existing Audio Recorder UI */}
//         {/* ... (your existing audio recorder UI code) */}

//         {/* Updated Transcript and Summary Display */}
//         {transcript && (
//           <div className="grid md:grid-cols-2 gap-6">
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <h3 className="text-xl font-semibold mb-4">Transcript</h3>
//               <div className="h-[calc(100vh-400px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
//                 <div className="prose max-w-none p-4">
//                   {transcript.split('\n').map((paragraph, idx) => (
//                     <p key={idx} className="mb-3 text-gray-700 leading-relaxed">{paragraph}</p>
//                   ))}
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <h3 className="text-xl font-semibold mb-4">Summary</h3>
//               <div className="h-[calc(100vh-400px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
//                 <div className="prose max-w-none p-4">
//                   {summary.split('\n').map((paragraph, idx) => (
//                     <p key={idx} className="mb-3 text-gray-700 leading-relaxed">{paragraph}</p>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Patient History Section */}
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h3 className="text-xl font-semibold mb-6">Previous Consultations</h3>
//           {patientHistory.length === 0 ? (
//             <div className="text-center py-8 text-gray-500">
//               No previous history found
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {patientHistory.map((record, index) => (
//                 <div key={index} className="border rounded-lg hover:bg-gray-50 transition-colors">
//                   <button
//                     onClick={() => setExpandedHistory(expandedHistory === index ? null : index)}
//                     className="w-full p-4 flex items-center justify-between"
//                   >
//                     <div className="flex items-center space-x-4">
//                       <Calendar className="h-5 w-5 text-gray-500" />
//                       <div className="text-left">
//                         <p className="font-medium">
//                           {new Date(record.date).toLocaleDateString()} - {record.time}
//                         </p>
//                       </div>
//                     </div>
//                     {expandedHistory === index ? 
//                       <ChevronUp className="h-5 w-5 text-gray-500" /> : 
//                       <ChevronDown className="h-5 w-5 text-gray-500" />
//                     }
//                   </button>
                  
//                   {expandedHistory === index && (
//                     <div className="px-4 pb-4">
//                       <div className="bg-gray-50 rounded-lg p-4">
//                         <pre className="whitespace-pre-wrap text-sm text-gray-700">
//                           {JSON.stringify(record.structuredOutput, null, 2)}
//                         </pre>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
    
//       </div>
        
//     </div>
//   );
// };

// export default AudioRecorder;




import  { useState, useRef, useEffect } from 'react';
import { Upload, Mic, CheckCircle, AlertCircle, Play, Ban as Stop, Send, User, Edit, Save, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { useParams } from 'react-router-dom';

const AudioRecorder = () => {
  // Keep existing audio recording states
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [speakerCount, setSpeakerCount] = useState(0);
  const [structuredOutput, setStructure] = useState('');

  
 const [ehrData, setEhrData] = useState({
    Chief_Complaint: "",
    Symptoms: "",
    Physical_Examination: "",
    Diagnosis: "",
    Medications: "",
    Treatment_Plan: "",
    Lifestyle_Modifications: {
      Diet: {
        Recommended: "",
        Restricted: ""
      },
      Exercise: "",
      Other_Recommendations: ""
    },
    Follow_up: {
      Timing: "",
      Special_Instructions: ""
    },
    Additional_Notes: ""
  });
  
  const [isEditing, setIsEditing] = useState(false); 
  // New states for patient info
  const [patientDetails, setPatientDetails] = useState(null);
  const [patientHistory, setPatientHistory] = useState([]);
  const [expandedHistory, setExpandedHistory] = useState(null);
  const audioRef = useRef(null);
  
  // Get appointment ID from URL
  
  const { appointmentId } = useParams();
  useEffect(() => {
    fetchPatientDetails();
    fetchPatientHistory();
  }, [appointmentId]);

  console.log(appointmentId)

  useEffect(() => {
    if (structuredOutput) {
      try {
        // If structuredOutput is a string, parse it to JSON
        const parsedData = typeof structuredOutput === 'string' 
          ? JSON.parse(structuredOutput) 
          : structuredOutput;
        
        setEhrData(parsedData);
      } catch (error) {
        console.error("Error parsing structured output:", error);
      }
    }
  }, [structuredOutput]);

 
  const fileInputRef = useRef(null);
 

  // File upload handler
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('audio/')) {
        const url = URL.createObjectURL(file);
        setAudioUrl(url);
        // Convert File to Blob and then to chunks for consistency with recorder
        file.arrayBuffer().then(buffer => {
          const blob = new Blob([buffer], { type: file.type });
          setAudioChunks([blob]);
        });
        setStatus('idle');
        setErrorMessage('');
      } else {
        setErrorMessage('Please upload an audio file');
        setStatus('error');
      }
    }
  };

  // Trigger file input click
  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  

  

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      setAudioChunks([]);

      recorder.ondataavailable = (event) => {
        setAudioChunks(current => [...current, event.data]);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      recorder.start();
      setRecording(true);
      setStatus('recording');
      setErrorMessage('');
    } catch (err) {
      setErrorMessage('Error accessing microphone. Please ensure microphone permissions are granted.',err);
      setStatus('error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
      setRecording(false);
      setStatus('idle');
    }
  };

  

  const uploadRecording = async () => {
    if (audioChunks.length === 0) return;

    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');
    formData.append('patientId', patientDetails.patientId);

    setStatus('uploading');
    try {
      const response = await fetch('http://localhost:5006/process-audio', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setTranscript(data.transcript);
      setSummary(data.summary);
      setStructure(data.structured);
      setSpeakerCount(data.speakerCount);
      console.log("Data---",structuredOutput);
      setStatus('processed');
    } catch (err) {
      setErrorMessage(err.message || 'Error processing audio');
      setStatus('error');
    }
  };

  const saveToDropbox = async () => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');
    formData.append('patientId', patientDetails.patientId);
    formData.append('appointmentId', appointmentId);
    formData.append('transcript', transcript);
    formData.append('summary', summary);
    // formData.append('structuredOutput',structuredOutput);
    formData.append('structuredOutput', JSON.stringify(ehrData));

    setStatus('uploading');
    try {
      const response = await fetch('http://localhost:5006/save-to-dropbox', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Save failed');
      }

      setStatus('success');
      setAudioChunks([]);
      setAudioUrl('');
      setTranscript('');
      setSummary('');
      setEhrData({
        Chief_Complaint: "",
        Symptoms: "",
        Physical_Examination: "",
        Diagnosis: "",
        Medications: "",
        Treatment_Plan: "",
        Lifestyle_Modifications: {
          Diet: {
            Recommended: "",
            Restricted: ""
          },
          Exercise: "",
          Other_Recommendations: ""
        },
        Follow_up: {
          Timing: "",
          Special_Instructions: ""
        },
        Additional_Notes: ""
      });
    } catch (err) {
      setErrorMessage(err.message || 'Error saving to Dropbox');
      setStatus('error');
    }
  };
  
  console.log('dbj');

  const fetchPatientDetails = async () => {
    const token = localStorage.getItem('jwt');
    try {
      const response = await fetch(`http://localhost:5003/api/doctor/patientDetails/${appointmentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 404) {
        setErrorMessage('Patient not found');
        return;
      }
      
      const data = await response.json();
      if (data.success && data.patient) {
        setPatientDetails(data.patient); // Set the patient object directly
      } else {
        setErrorMessage('Invalid patient data format');
      }
    } catch (err) {
      setErrorMessage('Error fetching patient details', err);
    }
  };

  const fetchPatientHistory = async () => {
    const token = localStorage.getItem('jwt');
    try {
      const response = await fetch(`http://localhost:5003/api/doctor/patientInfo/${appointmentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data= await response.json()

      console.log(data)
      
      // if (data.message === "No appointment records found for this patient") {
      //   setPatientHistory([]);
      //   return;
      // }
  
      
      
      if (data.records) {
        setPatientHistory(data.records);
      } else {
        setPatientHistory([]);  // Fallback to empty array if records not found
      }
    } catch (err) {
      setErrorMessage('Error fetching patient history', err);
    }
  };

  const handleEhrChange = (field, value) => {
    setEhrData(prev => {
      // Handle nested fields
      if (field.includes('.')) {
        const [parent, child, grandchild] = field.split('.');
        if (grandchild) {
          return {
            ...prev,
            [parent]: {
              ...prev[parent],
              [child]: {
                ...prev[parent][child],
                [grandchild]: value
              }
            }
          };
        } else {
          return {
            ...prev,
            [parent]: {
              ...prev[parent],
              [child]: value
            }
          };
        }
      } else {
        // Handle top-level fields
        return {
          ...prev,
          [field]: value
        };
      }
    });
  };

  // Toggle edit mode for EHR template
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const renderEhrTemplate = () => {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Electronic Health Record</h3>
          <button
            onClick={toggleEditMode}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4" />
                <span>Save</span>
              </>
            ) : (
              <>
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </>
            )}
          </button>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {/* Chief Complaint */}
          <div className="border rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Chief Complaint</label>
            {isEditing ? (
              <textarea
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={ehrData.Chief_Complaint || ''}
                onChange={(e) => handleEhrChange('Chief_Complaint', e.target.value)}
                rows="2"
              />
            ) : (
              <p className="text-gray-800">{ehrData.Chief_Complaint || 'Not available'}</p>
            )}
          </div>
          
          {/* Symptoms */}
          <div className="border rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms</label>
            {isEditing ? (
              <textarea
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={ehrData.Symptoms || ''}
                onChange={(e) => handleEhrChange('Symptoms', e.target.value)}
                rows="3"
              />
            ) : (
              <p className="text-gray-800">{ehrData.Symptoms || 'Not available'}</p>
            )}
          </div>
          
          {/* Physical Examination */}
          <div className="border rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Physical Examination</label>
            {isEditing ? (
              <textarea
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={ehrData.Physical_Examination || ''}
                onChange={(e) => handleEhrChange('Physical_Examination', e.target.value)}
                rows="3"
              />
            ) : (
              <p className="text-gray-800">{ehrData.Physical_Examination || 'Not available'}</p>
            )}
          </div>
          
          {/* Diagnosis */}
          <div className="border rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
            {isEditing ? (
              <textarea
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={ehrData.Diagnosis || ''}
                onChange={(e) => handleEhrChange('Diagnosis', e.target.value)}
                rows="2"
              />
            ) : (
              <p className="text-gray-800">{ehrData.Diagnosis || 'Not available'}</p>
            )}
          </div>
          
          {/* Medications */}
          <div className="border rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Medications</label>
            {isEditing ? (
              <textarea
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={ehrData.Medications || ''}
                onChange={(e) => handleEhrChange('Medications', e.target.value)}
                rows="3"
              />
            ) : (
              <p className="text-gray-800">{ehrData.Medications || 'Not available'}</p>
            )}
          </div>
          
          {/* Treatment Plan */}
          <div className="border rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Plan</label>
            {isEditing ? (
              <textarea
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={ehrData.Treatment_Plan || ''}
                onChange={(e) => handleEhrChange('Treatment_Plan', e.target.value)}
                rows="3"
              />
            ) : (
              <p className="text-gray-800">{ehrData.Treatment_Plan || 'Not available'}</p>
            )}
          </div>
          
          {/* Lifestyle Modifications */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">Lifestyle Modifications</h4>
            
            <div className="ml-2 space-y-3">
              {/* Diet */}
              <div>
                <h5 className="text-sm font-medium text-gray-700">Diet</h5>
                <div className="ml-2 mt-1 space-y-2">
                  <div>
                    <label className="block text-xs text-gray-500">Recommended</label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={ehrData.Lifestyle_Modifications?.Diet?.Recommended || ''}
                        onChange={(e) => handleEhrChange('Lifestyle_Modifications.Diet.Recommended', e.target.value)}
                      />
                    ) : (
                      <p className="text-gray-800">{ehrData.Lifestyle_Modifications?.Diet?.Recommended || 'Not available'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Restricted</label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={ehrData.Lifestyle_Modifications?.Diet?.Restricted || ''}
                        onChange={(e) => handleEhrChange('Lifestyle_Modifications.Diet.Restricted', e.target.value)}
                      />
                    ) : (
                      <p className="text-gray-800">{ehrData.Lifestyle_Modifications?.Diet?.Restricted || 'Not available'}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Exercise */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Exercise</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={ehrData.Lifestyle_Modifications?.Exercise || ''}
                    onChange={(e) => handleEhrChange('Lifestyle_Modifications.Exercise', e.target.value)}
                  />
                ) : (
                  <p className="text-gray-800">{ehrData.Lifestyle_Modifications?.Exercise || 'Not available'}</p>
                )}
              </div>
              
              {/* Other Recommendations */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Other Recommendations</label>
                {isEditing ? (
                  <textarea
                    className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={ehrData.Lifestyle_Modifications?.Other_Recommendations || ''}
                    onChange={(e) => handleEhrChange('Lifestyle_Modifications.Other_Recommendations', e.target.value)}
                    rows="2"
                  />
                ) : (
                  <p className="text-gray-800">{ehrData.Lifestyle_Modifications?.Other_Recommendations || 'Not available'}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Follow-up */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">Follow-up</h4>
            
            <div className="ml-2 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Timing</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={ehrData.Follow_up?.Timing || ''}
                    onChange={(e) => handleEhrChange('Follow_up.Timing', e.target.value)}
                  />
                ) : (
                  <p className="text-gray-800">{ehrData.Follow_up?.Timing || 'Not available'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Special Instructions</label>
                {isEditing ? (
                  <textarea
                    className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={ehrData.Follow_up?.Special_Instructions || ''}
                    onChange={(e) => handleEhrChange('Follow_up.Special_Instructions', e.target.value)}
                    rows="2"
                  />
                ) : (
                  <p className="text-gray-800">{ehrData.Follow_up?.Special_Instructions || 'Not available'}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Additional Notes */}
          <div className="border rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
            {isEditing ? (
              <textarea
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={ehrData.Additional_Notes || ''}
                onChange={(e) => handleEhrChange('Additional_Notes', e.target.value)}
                rows="3"
              />
            ) : (
              <p className="text-gray-800">{ehrData.Additional_Notes || 'Not available'}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Keep all existing audio recording functions
  // ... (startRecording, stopRecording, togglePlayback, uploadRecording, saveToDropbox)

  return (
    <div className="min-h-screen  p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Patient Details Card */}
        {patientDetails && (
          <div className="bg-white rounded-xl shadow-lg p-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {patientDetails.firstName} {patientDetails.lastName} 
                  </h1>
                  <p className="text-gray-600">{patientDetails.email}</p>
                </div>
              </div>
              <div className="mt-4 md:mt-0 grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">DOB</p>
                  <p className="font-medium">{new Date(patientDetails.dob).toLocaleDateString()}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium">{patientDetails.gender}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{patientDetails.phoneNumber}</p>
                </div>
              </div>
            </div>
          </div>
        )}

    {patientDetails && (
        <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Audio Recorder</h2>
        <p className="text-gray-600">Patient ID:{patientDetails.patientId} </p>
       </div>)}
      
       <div className="space-y-4">
       <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="audio/*"
            className="hidden"
          />
          <button
            onClick={triggerFileUpload}
            className="w-full py-3 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center space-x-2"
          >
            <Upload className="w-5 h-5" />
            <span>Upload Audio File</span>
          </button>
         <button
          onClick={recording ? stopRecording : startRecording}
          className={`w-full py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
            recording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          <Mic className="w-5 h-5" />
          <span>{recording ? 'Stop Recording' : 'Start Recording'}</span>
        </button>

        {audioUrl && (
          <div className="mt-4">
            <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />
            <button
              onClick={togglePlayback}
              className="w-full py-3 px-4 rounded-lg bg-gray-500 hover:bg-gray-600 text-white flex items-center justify-center space-x-2"
            >
              {isPlaying ? <Stop className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              <span>{isPlaying ? 'Stop' : 'Play Recording'}</span>
            </button>
          </div>
        )}

        {audioUrl && status !== 'processed' && (
          <button
            onClick={uploadRecording}
            disabled={status === 'uploading'}
            className="w-full py-3 px-4 rounded-lg bg-green-500 hover:bg-green-600 text-white flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Upload className="w-5 h-5" />
            <span>{status === 'uploading' ? 'Processing...' : 'Process Recording'}</span>
          </button>
        )}

        {/* {transcript && (
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg shadow-inner overflow-y-auto max-h-64">
              <h3 className="font-semibold mb-2">Transcript:</h3>
              <p className="text-gray-700 text-sm">{transcript}</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-inner overflow-y-auto max-h-48">
              <h3 className="font-semibold mb-2">Summary:</h3>
              <p className="text-gray-700 text-sm">{summary}</p>
            </div>
          </div>
        )} */}

        {transcript && (
          <button
            onClick={saveToDropbox}
            className="w-full py-3 px-4 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white flex items-center justify-center space-x-2"
          >
            <Send className="w-5 h-5" />
            <span>Save in EMR</span>
          </button>
        )}

        {status === 'success' && (
          <div className="p-4 bg-green-100 text-green-700 rounded-lg flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>Successfully saved the data</span>
          </div>
        )}

        {status === 'error' && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>{errorMessage}</span>
          </div>
        )}


      </div>
        {/* Keep existing Audio Recorder UI */}
        {/* ... (your existing audio recorder UI code) */}

        {/* Updated Transcript and Summary Display */}
        {transcript && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Transcript</h3>
              <div className="h-[calc(100vh-400px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <div className="prose max-w-none p-4">
                  {transcript.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-3 text-gray-700 leading-relaxed">{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Summary</h3>
              <div className="h-[calc(100vh-400px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <div className="prose max-w-none p-4">
                  {summary.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-3 text-gray-700 leading-relaxed">{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>

          <div className=''>
          <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Structured Output</h3>
              <div className="h-[calc(100vh-400px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <div className="prose max-w-none p-4">
                 
                    <p className="mb-3 text-gray-700 leading-relaxed">{structuredOutput}</p>
                
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-2 text-white">Speaker Count</h3>
      <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <h3 className=" text-lg">Number Of Speakers:</h3>
          <span className="text-3xl font-bold  ml-2">{speakerCount}</span>
        </div>
      </div>
    </div>
          </div>
          
        )}

        {/* EHR Template Section */}
        {transcript && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Structured Output</h3>
              <div className="h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <div className="prose max-w-none p-4">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700">{
                    typeof structuredOutput === 'string' ? structuredOutput : JSON.stringify(structuredOutput, null, 2)
                  }</pre>
                </div>
              </div>
            </div>

            <div className="rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-2 text-white">Speaker Count</h3>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg">Number Of Speakers:</h3>
                  <span className="text-3xl font-bold ml-2">{speakerCount}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* EHR Template */}
        {transcript && renderEhrTemplate()}

        {/* Patient History Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-6">Previous Consultations</h3>
          {patientHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No previous history found
            </div>
          ) : (
            <div className="space-y-4">
              {patientHistory.map((record, index) => (
                <div key={index} className="border rounded-lg hover:bg-gray-50 transition-colors">
                  <button
                    onClick={() => setExpandedHistory(expandedHistory === index ? null : index)}
                    className="w-full p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <div className="text-left">
                        <p className="font-medium">
                          {new Date(record.date).toLocaleDateString()} - {record.time}
                        </p>
                      </div>
                    </div>
                    {expandedHistory === index ? 
                      <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    }
                  </button>
                  
                  {expandedHistory === index && (
                    <div className="px-4 pb-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700">
                          {JSON.stringify(record.structuredOutput, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
    
      </div>
        
    </div>
  );
};

export default AudioRecorder;