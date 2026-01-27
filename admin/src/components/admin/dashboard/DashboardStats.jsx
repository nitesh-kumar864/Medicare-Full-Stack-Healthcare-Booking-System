import {
  IndianRupee,
  Calendar,
  Bed,
  UserCircle,
  Users,
  LayoutGrid,
  HeartPulse,
  AlertTriangle,
  XCircle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";

/* ================= REUSABLE CARD ================= */
export const DashboardCard = ({ icon, title, value, bg }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-md transition-all duration-300">
    <div className="flex items-center gap-3 mb-3">
      <div className={`p-3 rounded-xl ${bg}`}>{icon}</div>
    </div>
    <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
    <p className="text-gray-600 text-sm">{title}</p>
  </div>
);

/* ================= BED STATS CARDS ================= */
export const BedStatsCards = ({ bedStats }) => {
  const bedCards = [
    {
      label: "Total Beds",
      value: bedStats.totalBeds,
      icon: Bed,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Occupied Beds",
      value: bedStats.occupiedBeds,
      icon: XCircle,
      color: "bg-red-100 text-red-600",
    },
    {
      label: "Available Beds",
      value: bedStats.availableBeds,
      icon: CheckCircle,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "General Beds",
      value: bedStats.bedTypes?.general?.total || 0,
      icon: LayoutGrid,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      label: "ICU Beds",
      value: bedStats.bedTypes?.icu?.total || 0,
      icon: HeartPulse,
      color: "bg-rose-100 text-rose-600",
    },
    {
      label: "Emergency Beds",
      value: bedStats.bedTypes?.emergency?.total || 0,
      icon: AlertTriangle,
      color: "bg-amber-100 text-amber-600",
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {bedCards.map((item, index) => (
        <div
          key={index}
          className="bg-white border shadow-sm rounded-2xl p-6 flex items-center gap-4 hover:shadow-md transition-all duration-300"
        >
          <div className={`p-3 rounded-xl ${item.color}`}>
            <item.icon size={28} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            <p className="text-gray-600 text-sm">{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ================= MAIN STATS SECTION ================= */
const DashboardStats = ({
  dashData,
  bedStats,
  bedRevenue,
  appointmentRevenue,
  totalRevenue,
  fetchBedStats,
}) => {
  return (
    <>
      {/* REVENUE SUMMARY */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Revenue Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard
            icon={<IndianRupee className="text-amber-600" size={24} />}
            title="Total Revenue"
            value={`₹${totalRevenue.toLocaleString()}`}
            bg="bg-amber-100"
          />
          <DashboardCard
            icon={<Calendar className="text-purple-600" size={24} />}
            title="Appointment Revenue"
            value={`₹${appointmentRevenue.toLocaleString()}`}
            bg="bg-purple-100"
          />
          <DashboardCard
            icon={<Bed className="text-teal-600" size={24} />}
            title="Bed Revenue"
            value={`₹${bedRevenue.toLocaleString()}`}
            bg="bg-teal-100"
          />
        </div>
      </div>

      {/* KEY METRICS */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Key Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard
            icon={<UserCircle className="text-blue-600" size={24} />}
            title="Total Doctors"
            value={dashData.doctors}
            bg="bg-blue-100"
          />
          <DashboardCard
            icon={<Calendar className="text-purple-600" size={24} />}
            title="Total Appointments"
            value={dashData.appointments}
            bg="bg-purple-100"
          />
          <DashboardCard
            icon={<Users className="text-green-600" size={24} />}
            title="Registered Patients"
            value={dashData.patients}
            bg="bg-green-100"
          />
        </div>
      </div>

      {/* BED MANAGEMENT */}
      {bedStats && (
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Bed Management
            </h2>
            <button
              onClick={fetchBedStats}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <RefreshCw size={14} />
              Update Status
            </button>
          </div>

          <BedStatsCards bedStats={bedStats} />
        </div>
      )}
    </>
  );
};

export default DashboardStats;
