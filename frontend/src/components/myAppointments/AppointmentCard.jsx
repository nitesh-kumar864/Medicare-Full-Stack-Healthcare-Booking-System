import React from "react";
import { useNavigate } from "react-router-dom";

import {
  Calendar,
  Clock,
  MapPin,
  User,
  Stethoscope,
  XCircle,
  CreditCard,
  MessageSquare,
  Loader2,
  FileText,
} from "lucide-react";
import { joinAppointmentRoom } from "../../chat/joinRoom";


const AppointmentCard = ({
  item,
  doc,
  status,
  slotDateFormat,
  handlePayNow,
  cancelAppointment,
  handleDownloadPrescription,
  downloadingId,
  navigate,
  unreadMap
}) => {
  /* Status Badge Styles */
  const statusStyles = {
    confirmed: "bg-green-100 text-green-800 border-green-200",
    unpaid: "bg-amber-100 text-amber-800 border-amber-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
    completed: "bg-green-100 text-green-800 border-green-200",
  };

  const unreadCount = unreadMap?.[item._id] || 0;
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Doctor Image */}
          <div className="flex-shrink-0">
            <img
              className="bg-blue-600 w-32 h-32 rounded-2xl object-cover border-2 border-gray-100"
              src={doc.image}
              alt={doc.name}
            />
          </div>

          {/* Appointment Details */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {doc.name}
              </h3>

              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${statusStyles[status.type]}`}
              >
                {status.label}
              </span>

              <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                {doc.speciality}
              </span>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Detail
                icon={<Calendar />}
                label="Date"
                value={slotDateFormat(item.slotDate)}
              />

              <Detail
                icon={<Clock />}
                label="Time"
                value={item.slotTime}
              />

              <Detail
                icon={<Stethoscope />}
                label="Specialization"
                value={doc.speciality}
              />

              <Detail
                icon={<MapPin />}
                label="Address"
                value={
                  <>
                    <p>{doc.address?.line1}</p>
                    <p className="text-gray-600">
                      {doc.address?.line2}
                    </p>
                  </>
                }
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-100">
              <button
                onClick={() => navigate(`/appointments/${doc._id}`)}
                className="px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <User size={20} /> View Doctor
              </button>

              {/* Pay Now */}
              {status.type === "unpaid" && (
                <button
                  onClick={() => handlePayNow(item._id)}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <CreditCard size={20} />
                  Pay Now
                </button>
              )}
              {(item.isCompleted || item.payment) && (
                <button
                  onClick={() => handleDownloadPrescription(item._id)}
                  disabled={downloadingId === item._id}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {downloadingId === item._id ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <FileText size={20} />
                      Download Prescription
                    </>
                  )}
                </button>
              )}

              {/* CHAT BUTTON */}
              {!item.cancelled &&
                (item.payment === true || item.isCompleted === true) && (
                  <div className="relative w-fit">
                    <button
                      onClick={() => {
                        joinAppointmentRoom(item._id);
                        navigate(`/chat/${item._id}`);
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-green-400 to-green-950 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 relative"
                    >
                      <MessageSquare size={20} />
                      Chat

                      {unreadCount > 0 && (
                        <span className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 text-xs font-bold flex items-center justify-center text-white bg-red-500 rounded-full shadow">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  </div>
                )}

              {/* Cancel Appointment */}
              {item.status !== "cancelled" &&
                item.status !== "completed" && (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="px-6 py-3 bg-red-50 text-red-700 border border-red-200 rounded-xl font-semibold hover:bg-red-100 transition-colors flex items-center gap-2"
                  >
                    <XCircle size={20} /> Cancel Appointment
                  </button>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div
        className={`h-1.5 ${status.type === "confirmed"
          ? "bg-green-400"
          : status.type === "unpaid"
            ? "bg-yellow-400"
            : status.type === "cancelled"
              ? "bg-red-400"
              : "bg-blue-400"
          }`}
      ></div>
    </div>
  );
};

/* ----------  REUSABLE  ---------- */
const Detail = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 text-gray-700">
    <span className="text-gray-500">{icon}</span>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-sm">{value}</p>
    </div>
  </div>
);

export default AppointmentCard;
