import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, Users, Calendar, FileText } from 'lucide-react';
import { cn } from "@/lib/utils"

const LayoutAdmin = () => {
  const navItems = [
    { icon: <Home className="h-4 w-4" />, text: "Dashboard", path: "/admin-dashboard" },
    { icon: <Users className="h-4 w-4" />, text: "Doctors", path: "/admin-doctors" },
    { icon: <Calendar className="h-4 w-4" />, text: "Appointments", path: "/admin-appointments" },
    { icon: <FileText className="h-4 w-4" />, text: "Invoice", path: "/admin-invoice" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b z-50 h-16">
        <div className="flex items-center justify-between px-4 h-full">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <span className="text-xl font-bold">MEDISCRIBE</span>
          </div>
          
          {/* Profile Picture */}
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
            <img 
              src="img1.jpg" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* Main Layout (with spacing for header) */}
      <div className="pt-16 flex">
        {/* Fixed Sidebar */}
        <div className="fixed inset-y-16 left-0 w-64 bg-white border-r shadow-sm">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <SidebarItem 
                key={item.path}
                icon={item.icon}
                text={item.text}
                path={item.path}
              />
            ))}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="ml-64 flex-1 p-8">
          <main className="bg-white rounded-lg shadow-sm p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

// Sidebar Item Component using NavLink
const SidebarItem = ({ icon, text, path }) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        cn(
          "flex items-center w-full space-x-3 px-3 py-2 rounded-lg text-sm",
          "hover:bg-gray-100 transition-colors duration-200",
          isActive ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-600"
        )
      }
    >
      {icon}
      <span>{text}</span>
    </NavLink>
  );
};

export default LayoutAdmin;