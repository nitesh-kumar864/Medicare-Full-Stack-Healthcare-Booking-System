import {
  MessageSquare,
  Filter,
  RefreshCw,
} from "lucide-react";

const SupportHeaderFilter = ({
  statusFilter,
  setStatusFilter,
  stats = { total: 0, pending: 0, replied: 0 },
  fetchTickets,
}) => {
  return (
    <>
      {/* HEADER */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <MessageSquare className="text-primary" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Queries Tickets
            </h1>
            <p className="text-gray-600">
              Track and manage all your support queries
            </p>
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-500" />
            <h3 className="font-semibold text-gray-900">
              Filter Tickets
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-4 py-2 rounded-lg transition-all ${
                statusFilter === "all"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All ({stats.total})
            </button>

            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-4 py-2 rounded-lg transition-all ${
                statusFilter === "pending"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Pending ({stats.pending})
            </button>

            <button
              onClick={() => setStatusFilter("replied")}
              className={`px-4 py-2 rounded-lg transition-all ${
                statusFilter === "replied"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Replied ({stats.replied})
            </button>

            <button
              onClick={fetchTickets}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SupportHeaderFilter;
