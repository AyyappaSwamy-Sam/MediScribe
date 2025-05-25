import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  MessageSquare,
  Search,
  BellDot,
  ChevronDown,
  LogOut,
  Settings
} from 'lucide-react';
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth } from '../../context/AuthContext';

const LayoutAdmin = () => {
  const [selectedMenu, setSelectedMenu] = useState(null);
  const location = useLocation();
  const {logout, token} = useAuth();

  const handleLogout = () => {
    logout();
    console.log('LogOut is Completed hello');
  };

  const handleMenuClick = (menuText) => {
    setSelectedMenu(selectedMenu === menuText ? null : menuText);
  };

  const navItems = [
    {
      icon: <LayoutDashboard className="h-4 w-4" />,
      text: "Dashboard",
      path: "/admin-dashboard"
    },
    {
      icon: <Users className="h-4 w-4" />,
      text: "Doctors",
      submenu: [
        { text: "Doctor List", path: "/admin-doctors" },
        { text: "Add Doctor", path: "/admin-add-doctor" },      
      ]
    },
    {
      icon: <Calendar className="h-4 w-4" />,
      text: "Appointments",
      submenu: [
        { text: "Appointment List", path: "/admin-appointments" },
        { text: "Book Appointment", path: "/admin-book-appointments/" },
      ]
    },
    {
      icon: <Settings className="h-4 w-4" />,
      text: "Settings",
      submenu: [
        { text: "General Settings", path: "/admin-general-settings" },
        { text: "Security", path: "/admin-security" },
        { text: "Notifications", path: "admin-notifications" },
        { text: "Add Speaclity", path: "admin-add-speciality" },
        { text: "user Activity", path: "admin-user-acctivity" },

        // { text: "Billing & Payments", path: "/admin-settings/billing" },
        // { text: "System Updates", path: "/admin-settings/updates" }
      ]
    },
    {
      icon: <LogOut className="h-4 w-4" />,
      text: "Logout",
      path: "#",
      onClick: handleLogout
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b z-50 h-16">
        <div className="flex items-center justify-between px-4 h-full">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MS</span>
            </div>
            <span className="text-lg font-semibold">MediScribe</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search here"
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <BellDot className="h-5 w-5 text-gray-600" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                  <div className="text-right">
                    <div className="text-sm font-medium">Liam Michael</div>
                    <div className="text-xs text-gray-500">Admin</div>
                  </div>
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                    <img
                      src="/api/placeholder/32/32"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48" align="end">
                <DropdownMenuItem 
                  className="text-red-600 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="pt-16 flex">
        {/* Sidebar */}
        <div className="fixed inset-y-16 left-0 w-64 bg-white border-r">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <SidebarItem
                key={item.path || item.text}
                item={item}
                isOpen={selectedMenu === item.text}
                onToggle={() => handleMenuClick(item.text)}
              />
            ))}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="ml-64 flex-1 p-6">
          <div className="bg-white rounded-lg shadow-sm">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

// SidebarItem Component (unchanged)
const SidebarItem = ({ item, isOpen, onToggle }) => {
  const location = useLocation();
  const isActive = item.path === location.pathname || 
                  (item.submenu && item.submenu.some(subItem => subItem.path === location.pathname));

  if (item.onClick) {
    return (
      <button
        onClick={item.onClick}
        className={cn(
          "flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm",
          "hover:bg-gray-50 transition-colors duration-200",
          "text-red-600 hover:bg-red-50"
        )}
      >
        <div className="flex items-center space-x-3">
          {item.icon}
          <span>{item.text}</span>
        </div>
      </button>
    );
  }

  if (item.submenu) {
    return (
      <div>
        <div
          onClick={onToggle}
          className={cn(
            "flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm cursor-pointer",
            "hover:bg-gray-50 transition-colors duration-200",
            isActive ? "bg-gray-50 text-blue-600 font-medium" : "text-gray-700"
          )}
        >
          <div className="flex items-center space-x-3">
            {item.icon}
            <span>{item.text}</span>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isOpen ? "transform rotate-180" : ""
            )}
          />
        </div>
        
        {isOpen && (
          <div className="ml-4 mt-1 space-y-1">
            {item.submenu.map((subItem) => (
              <NavLink
                key={subItem.path}
                to={subItem.path}
                className={({ isActive }) =>
                  cn(
                    "block px-3 py-2 rounded-lg text-sm",
                    "hover:bg-gray-50 transition-colors duration-200",
                    isActive ? "text-blue-600 font-medium" : "text-gray-600"
                  )
                }
              >
                {subItem.text}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        cn(
          "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm",
          "hover:bg-gray-50 transition-colors duration-200",
          isActive ? "bg-gray-50 text-blue-600 font-medium" : "text-gray-700"
        )
      }
    >
      {item.icon}
      <span>{item.text}</span>
    </NavLink>
  );
};

export default LayoutAdmin;