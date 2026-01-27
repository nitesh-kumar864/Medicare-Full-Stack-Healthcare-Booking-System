import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow">
        <Navbar />
      </div>
      <div
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)]
          bg-white border-r shadow-sm overflow-y-auto
          transition-all duration-300 z-40
          ${collapsed ? "w-16" : "w-64"}
        `}
      >
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>
      <div
        className={`
          pt-20 p-6 min-h-screen transition-all duration-300
          ${collapsed ? "ml-16" : "ml-64"}
        `}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
