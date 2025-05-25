import  { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaPaperPlane, FaRobot, FaUser, FaHeadset } from 'react-icons/fa';
import FAQSection from '../../components/FAQSection';

const API_URL = 'http://localhost:5006/api/support';

const SupportPage = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);
  
  // Get userId from localStorage or generate a temporary one
  const userId = localStorage.getItem('mediscribe_user_id') || `temp_${Date.now()}`;
  
  const chatEndRef = useRef(null);
  
  // Scroll to bottom of chat whenever chat history updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);
  
  // Store userId in localStorage if not already there
  useEffect(() => {
    if (!localStorage.getItem('mediscribe_user_id')) {
      localStorage.setItem('mediscribe_user_id', userId);
    }
  }, [userId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    const userMessage = message;
    setMessage('');
    
    // Add user message to chat history
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    
    // Show loading indicator
    setIsLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/chat`, {
        message: userMessage,
        conversationId,
        userId
      });
      
      // Update conversation ID
      if (response.data.conversationId) {
        setConversationId(response.data.conversationId);
      }
      
      // Add bot response to chat history
      setChatHistory(prev => [...prev, { role: 'assistant', content: response.data.message }]);
      
      // Show feedback option after bot response
      setShowFeedback(true);
    } catch (error) {
      console.error('Error sending message:', error);
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again or contact human support.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const submitFeedback = async () => {
    try {
      await axios.post(`${API_URL}/feedback`, {
        conversationId,
        feedback: feedbackText,
        rating: feedbackRating
      });
      
      // Reset feedback form
      setShowFeedback(false);
      setFeedbackRating(0);
      setFeedbackText('');
      
      // Thank user for feedback
      setChatHistory(prev => [...prev, { 
        role: 'system', 
        content: 'Thank you for your feedback!' 
      }]);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const handleFAQClick = (question) => {
    setMessage(question);
  };

  const handleHumanSupportClick = () => {
    setShowContactForm(true);
  };

  const formatMessage = (content) => {
    // Simple markdown-like formatting
    const withBold = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    const withLinks = withBold.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">$1</a>');
    const withLineBreaks = withLinks.replace(/\n/g, '<br />');
    
    return <div dangerouslySetInnerHTML={{ __html: withLineBreaks }} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-blue-600 text-white flex items-center px-6 py-4 shadow-md">
        <div className="mr-4">
          <img 
            src="/mediscribe-logo.png" 
            alt="Mediscribe Logo" 
            className="h-10 w-auto"
            onError={(e) => e.target.src = "https://via.placeholder.com/150?text=Mediscribe"} 
          />
        </div>
        <h1 className="text-xl font-medium m-0">Mediscribe Support</h1>
      </header>
      
      <div className="flex flex-1 max-w-7xl mx-auto w-full p-4">
        <aside className="w-80 bg-white rounded-lg shadow-md p-6 mr-4 flex-shrink-0 h-[calc(100vh-7rem)] overflow-y-auto lg:block hidden">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Frequently Asked Questions</h2>
          <FAQSection onQuestionClick={handleFAQClick} />
          <div className="mt-8 text-center">
            <button 
              className="bg-green-600 text-white py-3 px-4 rounded flex items-center justify-center w-full gap-2 hover:bg-green-700 transition-colors"
              onClick={handleHumanSupportClick}
            >
              <FaHeadset /> Contact Human Support
            </button>
          </div>
        </aside>
        
        <main className="flex-1 bg-white rounded-lg shadow-md flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 flex flex-col">
            {chatHistory.length === 0 ? (
              <div className="text-center my-auto">
                <h2 className="text-xl font-semibold text-blue-600 mb-3">Welcome to Mediscribe Support</h2>
                <p className="text-gray-600">How can we help you today? Ask a question or select from the FAQs.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {chatHistory.map((chat, index) => (
                  <div key={index} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex max-w-[80%] ${chat.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center ${chat.role === 'user' ? 'ml-2' : 'mr-2'} ${chat.role === 'system' ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'}`}>
                        {chat.role === 'user' ? <FaUser /> : <FaRobot />}
                      </div>
                      <div className={`py-3 px-4 rounded-2xl ${
                        chat.role === 'user' 
                          ? 'bg-blue-600 text-white rounded-br-md' 
                          : chat.role === 'system'
                            ? 'bg-blue-50 text-gray-800 rounded-bl-md italic'
                            : 'bg-gray-100 text-gray-800 rounded-bl-md'
                      }`}>
                        {formatMessage(chat.content)}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex">
                      <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center mr-2">
                        <FaRobot />
                      </div>
                      <div className="py-3 px-4 rounded-2xl bg-gray-100 text-gray-800 rounded-bl-md">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            )}
            
            {showFeedback && !isLoading && (
              <div className="bg-gray-100 p-4 rounded-lg mt-4 mx-auto w-4/5 max-w-md">
                <div className="flex justify-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-2xl cursor-pointer ${star <= feedbackRating ? 'text-yellow-400' : 'text-gray-300'}`}
                      onClick={() => setFeedbackRating(star)}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <textarea
                  placeholder="Any additional feedback? (optional)"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md mb-2 resize-y min-h-16"
                ></textarea>
                <div className="flex justify-center gap-2">
                  <button 
                    onClick={submitFeedback}
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                  >
                    Submit Feedback
                  </button>
                  <button 
                    className="text-gray-600 py-2 px-4 hover:bg-gray-200 rounded transition-colors"
                    onClick={() => setShowFeedback(false)}
                  >
                    Skip
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <form 
            className="p-4 bg-gray-50 border-t border-gray-200 flex"
            onSubmit={handleSendMessage}
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your question here..."
              disabled={isLoading}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button 
              type="submit" 
              disabled={isLoading || !message.trim()}
              className="bg-blue-600 text-white w-12 h-12 rounded-r-full flex items-center justify-center disabled:bg-gray-400"
            >
              <FaPaperPlane />
            </button>
          </form>
        </main>
      </div>
      
      {/* Mobile FAQ button */}
      <div className="lg:hidden fixed bottom-20 right-4">
        <button 
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg"
          onClick={() => alert("FAQ section is only visible on larger screens!")}
        >
          <span className="text-lg font-bold">?</span>
        </button>
      </div>
      
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Contact Human Support</h2>
            <form className="space-y-4">
              <div>
                <label className="block mb-1 font-medium text-gray-700">Name</label>
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">Email</label>
                <input 
                  type="email" 
                  placeholder="your.email@example.com" 
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">Issue Type</label>
                <select className="w-full p-3 border border-gray-300 rounded-md">
                  <option>Account Issues</option>
                  <option>Technical Problems</option>
                  <option>Billing Questions</option>
                  <option>Feature Requests</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">Message</label>
                <textarea 
                  placeholder="Please describe your issue in detail"
                  className="w-full p-3 border border-gray-300 rounded-md resize-y min-h-32"
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  className="py-2 px-4 border border-gray-300 rounded-md text-gray-700"
                  onClick={() => setShowContactForm(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportPage;