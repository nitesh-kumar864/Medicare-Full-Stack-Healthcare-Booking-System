import React from "react";

const AdminPageLoader = ({
  title = "Loading...",
  subtitle = "Please wait...",
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="flex flex-col items-center gap-4">
        
        {/*  spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>

        {/*  text style */}
        <div className="text-center">
          <p className="text-gray-700 font-medium">{title}</p>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>

      </div>
    </div>
  );
};

export default AdminPageLoader;
