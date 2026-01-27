import {
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

const DashboardAppointments = ({
  appointments,
  slotDateFormat,
  cancelAppointment,
  isActionLoading,
}) => {
  const getAppointmentStatus = (item) => {
    if (item.cancelled) {
      return {
        text: "Cancelled",
        color: "text-red-600",
        bg: "bg-red-50",
        icon: <XCircle size={16} />,
      };
    }

    if (item.payment || item.isCompleted) {
      return {
        text: "Completed",
        color: "text-green-600",
        bg: "bg-green-50",
        icon: <CheckCircle size={16} />,
      };
    }

    return {
      text: "Upcoming",
      color: "text-blue-600",
      bg: "bg-blue-50",
      icon: <Clock size={16} />,
    };
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-900">
          Recent Appointments
        </h2>
        <p className="text-sm text-gray-600">
          Latest patient bookings
        </p>
      </div>

      <div className="divide-y">
        {appointments.map((item) => {
          const doctor = item.doctorData || {};
          const status = getAppointmentStatus(item);

          return (
            <div
              key={item._id}
              className="p-6 hover:bg-gray-50 flex flex-col md:flex-row justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-14 h-14 rounded-xl object-cover border"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/56";
                  }}
                />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {doctor.name}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {doctor.speciality}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {slotDateFormat(item.slotDate)} •{" "}
                    {item.slotTime}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-4">
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${status.bg} ${status.color}`}
                >
                  {status.icon}
                  {status.text}
                </div>

                {!item.cancelled &&
                  !item.payment &&
                  !item.isCompleted && (
                    <button
                      disabled={isActionLoading}
                      onClick={() =>
                        cancelAppointment(item._id)
                      }
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Cancel Appointment"
                    >
                      <XCircle size={20} />
                    </button>
                  )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardAppointments;
