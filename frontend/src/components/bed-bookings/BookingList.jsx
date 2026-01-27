import {
  Bed,
  User,
  Phone,
  Stethoscope,
  Calendar,
  Clock,
  XCircle,
  ChevronRight,
  CreditCard,
} from "lucide-react";
import { toast } from "react-toastify";

const BookingList = ({
  filteredBookings,
  getStatusBadge,
  startBedPayment,
  cancelBooking,
  setLoading,
}) => {
  if (filteredBookings.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 shadow-sm border text-center">
        <h3 className="text-xl font-semibold text-gray-900">
          No bookings found
        </h3>
        <button
          onClick={() => (window.location.href = "/bed-availability")}
          className="mt-4 px-6 py-3 bg-primary text-white rounded-xl font-semibold"
        >
          Book a Bed Now
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredBookings.map((b) => (
        <div
          key={b._id}
          className="bg-white rounded-2xl shadow-sm border hover:shadow-md transition-shadow"
        >
          <div className="p-6 flex flex-col lg:flex-row gap-6">
            {/* LEFT */}
            <div className="flex-1">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-xl bg-blue-50 flex flex-col items-center justify-center border">
                  <Bed className="text-primary" size={28} />
                  <span className="text-2xl font-bold">
                    {b.bedNumber}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold">
                      Bed #{b.bedNumber}
                    </h3>
                    {getStatusBadge(b)}
                    <span className="text-sm px-3 py-1 bg-gray-100 rounded-full capitalize">
                      {b.bedType} Ward
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-gray-700">
                    <div className="flex items-center gap-2">
                      <User size={18} />
                      <span>{b.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={18} />
                      <span>{b.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Stethoscope size={18} />
                      <span>{b.purpose}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={18} />
                      <span>
                        {new Date(b.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={18} />
                      <span>
                        {new Date(b.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="lg:w-auto flex flex-col gap-3">
              {!b.payment && b.status === "locked" && (
                <button
                  onClick={() => {
                    if (b.status !== "locked") {
                      toast.error(
                        "This booking has expired or been cancelled"
                      );
                      return;
                    }
                    startBedPayment(b._id, setLoading);
                  }}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold
                  hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <CreditCard size={20} />
                  Pay Now
                </button>
              )}

              {b.status !== "cancelled" && (
                <button
                  onClick={() => cancelBooking(b._id)}
                  className="px-6 py-3 bg-red-50 text-red-700 border border-red-200 rounded-xl flex items-center gap-2"
                >
                  <XCircle size={20} /> Cancel Booking
                </button>
              )}

              <button
                onClick={() =>
                  (window.location.href = "/bed-availability")
                }
                className="text-primary hover:text-primary-dark font-medium flex items-center gap-1 text-sm"
              >
                View Available Beds <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* TIMELINE */}
          <div
            className={`h-2 ${b.status === "booked"
                ? "bg-gradient-to-r from-yellow-300 to-yellow-500"
                : "bg-gray-300"
              }`}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default BookingList;
