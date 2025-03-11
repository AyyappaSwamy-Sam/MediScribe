

import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useMatch, useResolvedPath } from 'react-router-dom';
import { assets } from '../assets/assets_frontend/assets';
import AccountMenu from './AccountMenu';
import {useAuth} from '../context/AuthContext'

const NavItem = ({ to, children }) => {
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end: true });

  return (
    <NavLink 
      to={to} 
      className={`relative py-1 ${match ? 'text-primary' : ''}`}
    >
      {children}
      <hr className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 border-none outline-none h-0.5 bg-primary w-3/5 transition-opacity duration-300 ${match ? 'opacity-100' : 'opacity-0'}`} />
    </NavLink>
  );
};
    
    
const DoctorNavbar = () => {
      const navigate = useNavigate();
      const {token , setToken} = useAuth();
      // const [token, setToken] = useState(false);
      
      useEffect(() => {
        // Check for token in localStorage on component mount
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);  // Update token in context if found
        }
      }, [setToken]);
    
      return (
        <nav className="sticky top-0 bg-white z-10 shadow-sm">
          <div className="container  px-4">
            <div className="flex items-center justify-between py-4">
              <img className="w-44 cursor-pointer" src={assets.logo1} alt="Logo" onClick={() => navigate('/')} />
                
              <ul className="hidden md:flex items-center space-x-6 font-medium">
                
                <NavItem to="/doctor-page">Dashboard</NavItem>
                <NavItem to="/doctor-page/appointments">Appointments</NavItem>
                <NavItem to="/contact">Contact</NavItem>
                <NavItem to="/about">About Us</NavItem>
              </ul>
              
              <div className="flex items-center">
                {token ? (
                  <AccountMenu />
                ) : (
                  <button
                    onClick={() => navigate('/auth')}
                    className="bg-primary text-white px-6 py-2 rounded-full font-medium hover:bg-primary-dark transition duration-300 ease-in-out"
                  >
                    Create Account
                  </button>
                )}
              </div>
              </div> 
              
          </div>
        </nav>
      );
    };
    
export default DoctorNavbar;