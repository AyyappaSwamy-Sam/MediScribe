import React from 'react'
import Navbar from '../../components/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
const Layout = () => {
  return (
    <div className='overscroll-none'>
      <Navbar />
      <div className='flex flex-col min-h-screen'>
        <Outlet />
      </div>
      <Footer />
      
    </div>
  )
}

export default Layout
