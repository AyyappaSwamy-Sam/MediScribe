import React from 'react'
import { Outlet } from 'react-router-dom'
import DoctorNavbar from '../../components/DoctorNavbar'
import Footer from './Footer'
const LayoutDoctor = () => {
  return (
    <div>
      <DoctorNavbar />
      <div>
        <Outlet />
      </div>
      <Footer />
      
    </div>
  )
}

export default LayoutDoctor
