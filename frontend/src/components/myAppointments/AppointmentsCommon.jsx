import React from "react";
import { Calendar, User } from "lucide-react";

/* ----------    STATS CARD ----------  */
export const StatsCard = ({ count, label, icon, color }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <h3 className="text-3xl font-bold text-gray-900">{count}</h3>
        </div>
        <div className={`p-3 bg-${color}-100 rounded-xl text-${color}-600`}>
          {icon}
        </div>
      </div>
    </div>
  );
};


/* ----------     EMPTY STATE---------- */

export const EmptyState = ({ filter, navigate }) => {
  return (
    <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
          <Calendar className="text-gray-400" size={40} />
        </div>

        <h3 className="text-xl font-semibold text-gray-900">
          No appointments found
        </h3>

        <p className="text-gray-600 max-w-md">
          {filter === "upcoming"
            ? "You don’t have any upcoming appointments."
            : filter === "completed"
              ? "No completed appointments yet."
              : filter === "cancelled"
                ? "You haven’t cancelled any appointments."
                : "You haven’t booked any appointments yet."}
        </p>

        <button
          onClick={() => navigate("/doctors")}
          className="mt-4 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <User size={20} /> Book New Appointment
        </button>
      </div>
    </div>
  );
};
