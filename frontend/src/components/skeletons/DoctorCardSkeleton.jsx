import React from "react";

const DoctorCardSkeleton = () => {
  return (
    <div className="border border-blue-200 rounded-xl overflow-hidden p-4 animate-pulse">
      
      {/* Image skeleton */}
      <div className="w-full h-60 bg-slate-200 rounded-lg mb-4" />

      {/* Availability */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-slate-300" />
        <div className="h-3 w-20 bg-slate-200 rounded" />
      </div>

      {/* Name */}
      <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />

      {/* Speciality */}
      <div className="h-3 bg-slate-200 rounded w-1/2" />
    </div>
  );
};

export default DoctorCardSkeleton;
