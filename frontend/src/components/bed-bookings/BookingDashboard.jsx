import {
  Bed,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";

const BookingDashboard = ({
  total,
  paid,
  cancelled,
  filter,
  setFilter,
}) => {
  return (
    <>
      {/* HEADER */}
      <div className="mb-8 flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Bed className="text-primary" size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            My Bed Bookings
          </h1>
          <p className="text-gray-600">
            Manage and track all your bed reservations
          </p>
        </div>
      </div>

      {/* DASHBOARD CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          {
            label: "Total Bookings",
            value: total,
            icon: <Calendar size={24} />,
            color: "blue",
          },
          {
            label: "Paid",
            value: paid,
            icon: <CheckCircle size={24} />,
            color: "green",
          },
          {
            label: "Cancelled",
            value: cancelled,
            icon: <XCircle size={24} />,
            color: "red",
          },
        ].map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  {card.label}
                </p>
                <h3 className="text-3xl font-bold text-gray-900">
                  {card.value}
                </h3>
              </div>
              <div
                className={`p-3 bg-${card.color}-100 rounded-xl text-${card.color}-600`}
              >
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FILTER BAR */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-wrap gap-2">
          {[
            { key: "all", label: `All (${total})` },
            { key: "paid", label: `Paid (${paid})` },
            { key: "cancelled", label: `Cancelled (${cancelled})` },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key)}
              className={`px-4 py-2 rounded-xl ${filter === item.key
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default BookingDashboard;
