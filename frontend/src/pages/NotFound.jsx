import React, { useState, useEffect } from "react";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* 404 Title */
const GlitchHeader = () => (
  <div className="relative mb-8 select-none">
   <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-red-400 animate-pulse select-none">
      404
    </h1>
  </div>
);

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "404 - Page Not Found";
  }, []);

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-50 px-4 overflow-hidden">
      

      {/* Content */}
      <div className="relative z-10 max-w-2xl text-center">
        <GlitchHeader />

        <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
          Oops! Page Not Found
        </h2>

        <p className="mt-3 text-slate-600 text-lg leading-relaxed">
          The page you are trying to access doesn’t exist.
        </p>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-white font-medium
                       hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/30"
          >
            <Home className="w-5 h-5" />
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
