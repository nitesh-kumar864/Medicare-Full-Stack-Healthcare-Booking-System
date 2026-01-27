import { RefreshCw } from "lucide-react";

const DashboardHeader = ({
  refreshAllData,
  isActionLoading,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 text-sm">
          Overview of hospital performance
        </p>
      </div>

      <button
        onClick={refreshAllData}
        disabled={isActionLoading}
        className="px-4 py-2 bg-white border rounded-xl text-gray-700 flex items-center gap-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RefreshCw
          size={18}
          className={isActionLoading ? "animate-spin" : ""}
        />
        {isActionLoading ? "Refreshing..." : "Refresh"}
      </button>
    </div>
  );
};

export default DashboardHeader;
