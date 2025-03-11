import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { InfoCardsContainer } from '../../components/InfoCard'
import { assets } from '../../assets/assets_frontend/assets'
import Faq1 from '../../components/Faq1'



const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-manrope font-bold text-center mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
            Your AI-Powered Assistant for EMR Notes
          </span>
        </h1>
        <div className="max-w-2xl mx-auto text-center">
          <h4 className="text-lg md:text-xl font-manrope font-semibold text-new_color mb-2">
            With Mediscribe, transform patient interactions into EMR-ready notes.
          </h4>
          <h6 className="text-base md:text-lg font-manrope font-semibold text-new_color">
            Accurate, Efficient, and Simple.
          </h6>
        </div>
        <div className="flex justify-center mt-8">
          <button 
            onClick={() => navigate('/doctors')} 
            className="group relative inline-block"
          >
            <span className="relative z-10 block px-6 py-3 text-base md:text-lg font-medium text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white overflow-hidden">
              <span className="absolute inset-0 w-full h-full bg-gray-50 group-hover:bg-gray-900 transition-colors duration-300"></span>
              <span className="relative">Book Appointment</span>
            </span>
          </button>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-12">
        <h2 className="text-3xl md:text-4xl font-manrope font-bold text-center text-new_color mb-10">
          Why Choose Mediscribe?
        </h2>
        <InfoCardsContainer />
      </section>

      {/* FAQ Section */}
      <section className="py-12">
        <Faq1 />
      </section>

     
    </div>
  );
};

export default Home;