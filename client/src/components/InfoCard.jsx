// import {
//   Card,
//   CardBody,
//   Typography,
// } from "@material-tailwind/react";

// function InfoCard({ title, description }) {
//   return (
//     <Card className="w-full max-w-[26rem] p-2 rounded-md shadow-lg border-2 border-gray-700 transition-transform duration-300 hover:bg-gray-100 hover:-translate-y-2">
//       <CardBody>
//         <Typography variant="h5" color="blue-gray" className="mb-2 font-bold">
//           {title}
//         </Typography>
//         <Typography color="gray" className="font-normal">
//           {description}
//         </Typography>
//       </CardBody>
//     </Card>
//   );
// }




// export function InfoCardsContainer() {
//   const cardsData = [
//     {
//       title: "Record Patient Conversations",
//       description: "Our app seamlessly records conversations between patients and doctors, ensuring no important details are missed. Enjoy hassle-free documentation  by AI.",
//     },
//     {
//       title: "AI-Powered Transcription",
//       description: "Using advanced AI technology, we can transcribe and summarize medical notes. Doctors can review and validate the information before saving to the EMR.",
//     },
//     {
//       title: "Easy Appointment Scheduling",
//       description: "Patients can easily schedule appointments through our user-friendly app.  Receive timely reminders and updates to ensure you never miss an appointment.",
//     },
//     {
//       title: "Seamless EMR Integration",
//       description: "After verifying the notes, doctors can push the information directly to the EMR. This ensures efficient record-keeping and access to important patient data.",
//     },
//   ];

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-center">
//       {cardsData.map((card, index) => (
//         <div key={index} className="flex-none mb-4">
//           <InfoCard title={card.title} description={card.description} />
//         </div>
//       ))}
//     </div>
//   );
// }

import React from 'react';
import { ClipboardList, Brain, Calendar, Database } from 'lucide-react';

const FeatureCard = ({ title, description, icon: Icon }) => (
  <div className="p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
    <div className="flex items-center mb-4">
      <Icon className="w-6 h-6 mr-3 text-pink-500" />
      <h3 className="text-lg font-manrope font-semibold text-gray-900">{title}</h3>
    </div>
    <p className="text-gray-600 font-manrope">{description}</p>
  </div>
);

export  function InfoCardsContainer() {
  const features = [
    {
      title: "Record Patient Conversations",
      description: "Our app seamlessly records conversations between patients and doctors, ensuring no important details are missed. Enjoy hassle-free documentation by AI.",
      icon: ClipboardList
    },
    {
      title: "AI-Powered Transcription",
      description: "Using advanced AI technology, we can transcribe and summarize medical notes. Doctors can review and validate the information before saving to the EMR.",
      icon: Brain
    },
    {
      title: "Easy Appointment Scheduling",
      description: "Patients can easily schedule appointments through our user-friendly app. Receive timely reminders and updates to ensure you never miss an appointment.",
      icon: Calendar
    },
    {
      title: "Seamless EMR Integration",
      description: "After verifying the notes, doctors can push the information directly to the EMR. This ensures efficient record-keeping and access to important patient data.",
      icon: Database
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
      {features.map((feature, index) => (
        <FeatureCard key={index} {...feature} />
      ))}
    </div>
  );
}