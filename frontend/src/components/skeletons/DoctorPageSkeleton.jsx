import React from "react";
import DoctorCardSkeleton from "./DoctorCardSkeleton";

const DoctorPageSkeleton = () => {
  return (
    <div className="pt-24 pb-10 animate-pulse">

      {/* Title */}
      <div className="h-4 w-60 bg-slate-200 rounded mb-6" />

      {/* Search bar skeleton */}
      <div className="w-full sm:w-1/2 mb-6">
        <div className="h-12 bg-slate-200 rounded-full" />
      </div>

      <div className="flex flex-col sm:flex-row gap-6">

        {/* Left filters skeleton */}
        <div className="flex flex-col gap-3 w-56">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-10 bg-slate-200 rounded-full"
            />
          ))}
        </div>

        {/* Doctor cards skeleton grid */}
        <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <DoctorCardSkeleton key={i} />
          ))}
        </div>

      </div>
    </div>
  );
};

export default DoctorPageSkeleton;
