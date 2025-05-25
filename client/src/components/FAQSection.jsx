import React from 'react';

const faqList = [
  {
    category: "Appointments",
    questions: [
      "How do I book an appointment?",
      "Can I reschedule my appointment?",
      "What's the cancellation policy?",
      "How do I see my upcoming appointments?"
    ]
  },
  {
    category: "Recording & Transcription",
    questions: [
      "How do I record a conversation?",
      "How long does transcription take?",
      "Can I edit the transcription?",
      "Is my data secure?"
    ]
  },
  {
    category: "Account & Billing",
    questions: [
      "How do I reset my password?",
      "Can I change my email address?",
      "What subscription plans do you offer?",
      "How do I update my payment method?"
    ]
  },
  {
    category: "Technical Support",
    questions: [
      "The app is crashing, what should I do?",
      "Can I use Mediscribe offline?",
      "Which devices are supported?",
      "How do I export my data?"
    ]
  }
];

const FAQSection = ({ onQuestionClick }) => {
  return (
    <div className="space-y-6">
      {faqList.map((category, index) => (
        <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
          <h3 className="font-medium text-gray-800 mb-2">{category.category}</h3>
          <ul className="space-y-1">
            {category.questions.map((question, qIndex) => (
              <li 
                key={qIndex} 
                onClick={() => onQuestionClick(question)}
                className="text-blue-600 hover:text-blue-800 cursor-pointer py-1 text-sm hover:underline"
              >
                {question}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default FAQSection;