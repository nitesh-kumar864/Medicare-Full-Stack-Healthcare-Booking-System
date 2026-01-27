import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import Loader from "./Loader";

import {
  LayoutDashboard,
  CalendarDays,
  UserPlus,
  Users,
  MessageSquare,
  BedSingle,
  ClipboardList,
  UserCircle,
  ChevronLeft,
  ChevronRight,
  Home
} from "lucide-react";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { aToken, isAdminLoading } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  if (isAdminLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center bg-white">
        <Loader />
      </div>
    );
  }

  const MenuItem = ({ to, Icon, label }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 py-3 px-4 mx-2 my-1 rounded-lg transition-all duration-200
        ${isActive 
          ? "bg-blue-50 text-blue-700 font-medium border-l-4 border-blue-500" 
          : "text-gray-600 hover:bg-gray-50"
        }
        ${collapsed ? "justify-center px-3" : ""}`
      }
      end
    >
      <Icon size={22} className={collapsed ? "" : ""} />
      {!collapsed && <span className="text-sm">{label}</span>}
    </NavLink>
  );

  // Check if any token exists - fallback to home if none
  const hasAccess = aToken || dToken;

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between relative min-h-[64px]">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Home size={20} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Hospital System</p>
            </div>
          </div>
        )}
        
        {/* Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 bg-white border border-gray-300 rounded-full p-1.5 shadow-md hover:bg-gray-50 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto py-4">
        {hasAccess ? (
          <>
            {/* Admin Menu */}
            {aToken && (
              <div className="mb-6">
                {!collapsed && (
                  <p className="text-xs text-gray-400 uppercase font-semibold px-4 mb-2">
                    Admin Panel
                  </p>
                )}
                <div className="space-y-1">
                  <MenuItem to="/admin/dashboard" Icon={LayoutDashboard} label="Dashboard" />
                  <MenuItem to="/admin/all-appointments" Icon={CalendarDays} label="Appointments" />
                  <MenuItem to="/admin/add-doctor" Icon={UserPlus} label="Add Doctor" />
                  <MenuItem to="/admin/doctors-list" Icon={Users} label="Doctors List" />
                  <MenuItem to="/admin/support-queries" Icon={MessageSquare} label="Queries" />
                  <MenuItem to="/admin/beds" Icon={BedSingle} label="Manage Beds" />
                  <MenuItem to="/admin/bed-bookings" Icon={ClipboardList} label="Booked Beds" />
                </div>
              </div>
            )}

            {/* Doctor Menu */}
            {dToken && (
              <div className="mb-6">
                {!collapsed && (
                  <p className="text-xs text-gray-400 uppercase font-semibold px-4 mb-2">
                    Doctor Panel
                  </p>
                )}
                <div className="space-y-1">
                  <MenuItem to="/doctor/dashboard" Icon={LayoutDashboard} label="Dashboard" />
                  <MenuItem to="/doctor/appointments" Icon={CalendarDays} label="Appointments" />
                  <MenuItem to="/doctor/profile" Icon={UserCircle} label="Profile" />
                </div>
              </div>
            )}
          </>
        ) : (
          // Fallback when no token exists
          <div className="p-4 text-center">
            <p className="text-gray-500 text-sm">No access</p>
            <NavLink 
              to="/" 
              className="mt-2 inline-block text-blue-600 hover:text-blue-800 text-sm"
            >
              Go to Home
            </NavLink>
          </div>
        )}
      </div>

      {/* Footer - Show current user */}
      {!collapsed && hasAccess && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-medium text-sm">
                {aToken ? "A" : "D"}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                {aToken ? "Administrator" : "Doctor"}
              </p>
              <p className="text-xs text-gray-500">
                {aToken ? "Full Access" : "Limited Access"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;