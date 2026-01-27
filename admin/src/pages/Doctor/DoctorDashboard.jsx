import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import Loader from "../../components/Loader";

import {
  IndianRupee,
  CalendarDays,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  List,
} from "lucide-react";

const DashDashboard = () => {
  const {
    dToken,
    dashData,
    getDashData,
    completeAppointment,
    cancelAppointment,
    isPageLoading,
    isActionLoading,
  } = useContext(DoctorContext);

  const { slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken]);
  const handleCancel = async (id) => {
    await cancelAppointment(id);
    await getDashData(); 
  };

  const handleComplete = async (id) => {
    await completeAppointment(id);
    await getDashData(); 
  };

  if (isPageLoading || !dashData) {
    return (
      <Loader
        title="Loading Dashboard"
        subtitle="Preparing your dashboard..."
      />
    );
  }

  return (
    <div className="p-6 md:p-10 bg-gradient-to-b from-gray-50 to-blue-50 min-h-screen">

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">

        <TopCard
          icon={<IndianRupee className="text-blue-600" size={24} />}
          value={`₹ ${dashData.earnings}`}
          label="Earnings"
          bg="bg-blue-100"
        />

        <TopCard
          icon={<CalendarDays className="text-purple-600" size={24} />}
          value={dashData.appointments}
          label="Appointments"
          bg="bg-purple-100"
        />

        <TopCard
          icon={<Users className="text-green-600" size={24} />}
          value={dashData.patients}
          label="Patients"
          bg="bg-green-100"
        />

      </div>

      {/* LATEST BOOKINGS */}
      <div className="bg-white border shadow-sm rounded-2xl overflow-hidden">

        <div className="p-6 border-b flex items-center gap-3">
          <List size={20} className="text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Latest Bookings
          </h2>
        </div>

        <div>
          {dashData.latestAppointments.map((item) => {
            const user = item.userData;

            const status = item.cancelled
              ? {
                text: "Cancelled",
                color: "text-red-600",
                bg: "bg-red-50",
                icon: <XCircle size={16} />,
              }
              : item.payment || item.isCompleted
                ? {
                  text: "Completed",
                  color: "text-green-600",
                  bg: "bg-green-50",
                  icon: <CheckCircle size={16} />,
                }
                : {
                  text: "Pending",
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                  icon: <Clock size={16} />,
                };

            return (
              <div
                key={item._id}
                className="px-6 py-5 flex justify-between items-center hover:bg-gray-50 border-b last:border-none transition-all"
              >
                {/* User Info */}
                <div className="flex items-center gap-4">
                  {user.image ? (
                    <img
                      src={user.image}
                      className="w-12 h-12 rounded-full object-cover border"
                      alt=""
                    />
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 font-bold">
                      {user.name.charAt(0)}
                    </div>
                  )}

                  <div>
                    <p className="text-gray-800 font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">
                      {slotDateFormat(item.slotDate)} • {item.slotTime}
                    </p>
                  </div>
                </div>

                {/* Status / Actions */}
                <div className="flex items-center gap-4">

                  {/* STATUS BADGE */}
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${status.bg} ${status.color}`}
                  >
                    {status.icon}
                    {status.text}
                  </span>

                  {/* ACTION BUTTONS */}
                  {!item.cancelled && !item.payment && !item.isCompleted && (
                    <div className="flex gap-2">

                      {/* CANCEL */}
                      <button
                        disabled={isActionLoading}
                        onClick={() => handleCancel(item._id)}
                        className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-40"
                      >
                        <XCircle size={18} />
                      </button>

                      {/* COMPLETE */}
                      <button
                        disabled={isActionLoading}
                        onClick={() => handleComplete(item._id)}
                        className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition disabled:opacity-40"
                      >
                        <CheckCircle size={18} />
                      </button>

                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};


export default DashDashboard;

/* ---------------------------------------
        REUSABLE TOP CARD COMPONENT
---------------------------------------- */

const TopCard = ({ icon, value, label, bg }) => (
  <div className="bg-white rounded-2xl p-6 border shadow-sm hover:shadow-md transition-all flex items-center gap-4">
    <div className={`p-3 rounded-xl ${bg}`}>{icon}</div>

    <div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-gray-500 text-sm">{label}</p>
    </div>
  </div>
);
