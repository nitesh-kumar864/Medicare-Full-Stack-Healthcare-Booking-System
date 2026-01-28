import React from "react";
import DoctorCardSkeleton from "./DoctorCardSkeleton";

const DoctorSkeletonGrid = () => {
  return (
    <div className="pt-24">
      <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">

        {/* Title skeleton */}
        <div className="h-8 w-64 bg-slate-200 rounded animate-pulse" />

        {/* Cards grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-5 gap-y-6 sm:px-0">
          {Array.from({ length: 10 }).map((_, index) => (
            <DoctorCardSkeleton key={index} />
          ))}
        </div>

      </div>
    </div>
  );
};

export default DoctorSkeletonGrid;
