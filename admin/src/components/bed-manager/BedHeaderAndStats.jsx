import {
  Bed,
  Users,
  Shield,
  Zap,
  RefreshCw,
} from "lucide-react";

const BedHeaderAndStats = ({
  config,
  fetchConfig,
  calculateUtilizationColor,
}) => {
  return (
    <>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
              <Bed className="text-white" size={26} />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                Bed Management
              </h1>
              <p className="text-gray-600 mt-1">
                Monitor and configure hospital bed allocations in real-time
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-gray-700">Live Dashboard</span>
          </div>
          <button
            onClick={fetchConfig}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw size={18} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* TOTAL */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-blue-50 rounded-lg">
              <Bed className="text-blue-600" size={20} />
            </div>
            <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
              Total
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {config.totalBeds}
          </h3>
          <p className="text-sm text-gray-500">Hospital Beds</p>
        </div>

        {/* OCCUPIED */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-emerald-50 rounded-lg">
              <Users className="text-emerald-600" size={20} />
            </div>
            <span className="text-xs font-medium px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full">
              Occupied
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {config.occupiedBeds}
          </h3>
          <p className="text-sm text-gray-500">Beds in Use</p>
        </div>

        {/* AVAILABLE */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-cyan-50 rounded-lg">
              <Shield className="text-cyan-600" size={20} />
            </div>
            <span className="text-xs font-medium px-2 py-1 bg-cyan-50 text-cyan-700 rounded-full">
              Available
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {config.availableBeds}
          </h3>
          <p className="text-sm text-gray-500">Ready for Patients</p>
        </div>

        {/* UTILIZATION */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-violet-50 rounded-lg">
              <Zap
                className={calculateUtilizationColor(config.utilization)}
                size={20}
              />
            </div>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                config.utilization >= 90
                  ? "bg-red-50 text-red-700"
                  : config.utilization >= 70
                  ? "bg-amber-50 text-amber-700"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              Utilization
            </span>
          </div>
          <h3
            className={`text-3xl font-bold mb-1 ${calculateUtilizationColor(
              config.utilization
            )}`}
          >
            {config.utilization}%
          </h3>
          <p className="text-sm text-gray-500">Bed Capacity Usage</p>
        </div>
      </div>
    </>
  );
};

export default BedHeaderAndStats;
