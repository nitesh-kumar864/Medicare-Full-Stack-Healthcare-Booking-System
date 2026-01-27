import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const DoctorLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  

  const sidebarWidth = sidebarCollapsed ? 80 : 256;

  return (
    <div className="min-h-screen bg-[#F8F9FD]">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      <div className="flex pt-16"> 
        {/* SIDEBAR - Fixed on left */}
        <div 
          className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r shadow-sm overflow-y-auto transition-all duration-300"
          style={{ width: `${sidebarWidth}px` }}
        >
          <Sidebar 
            collapsed={sidebarCollapsed} 
            setCollapsed={setSidebarCollapsed} 
          />
        </div>

        {/* MAIN CONTENT */}
        <div 
          className="flex-1 min-h-[calc(100vh-4rem)] overflow-y-auto transition-all duration-300"
          style={{ marginLeft: `${sidebarWidth}px` }}
        >
          <div className="p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorLayout;