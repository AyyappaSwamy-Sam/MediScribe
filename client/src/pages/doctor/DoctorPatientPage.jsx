


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




import React, { useState, useRef, useEffect } from 'react';
import { Upload, Mic, CheckCircle, AlertCircle, Play, Ban as Stop, Send, User, Clock, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
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
      setErrorMessage('Error accessing microphone. Please ensure microphone permissions are granted.');
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
    formData.append('structuredOutput',structuredOutput);

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
      setErrorMessage('Error fetching patient details');
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
      setErrorMessage('Error fetching patient history');
    }
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