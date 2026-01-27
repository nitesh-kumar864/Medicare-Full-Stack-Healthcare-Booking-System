import {
  Bed,
  Users,
  Shield,
  Zap,
  Filter,
  Search,
} from "lucide-react";

const BedDashboard = ({
  stats,
  selectedType,
  setSelectedType,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <>
      {/* HEADER */}
      <div className="mb-8 flex">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Bed className="text-primary" size={28} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Bed Management
            </h1>
          </div>
          <p className="text-gray-600">
            Monitor and manage bed availability across all departments
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Bed className="text-blue-600" size={24} />
            </div>
            <span className="text-sm text-gray-500">Total</span>
          </div>
          <h3 className="text-3xl font-bold">{stats.total}</h3>
        </div>

        {/* Available */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <Shield className="text-green-600" size={24} />
            </div>
            <span className="text-sm text-gray-500">Available</span>
          </div>
          <h3 className="text-3xl font-bold">{stats.available}</h3>
        </div>

        {/* Occupied */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <Users className="text-red-600" size={24} />
            </div>
            <span className="text-sm text-gray-500">Occupied</span>
          </div>
          <h3 className="text-3xl font-bold">{stats.occupied}</h3>
        </div>

        {/* Utilization */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Zap className="text-purple-600" size={24} />
            </div>
            <span className="text-sm text-gray-500">Utilization</span>
          </div>
          <h3 className="text-3xl font-bold">
            {stats.utilization}%
          </h3>
        </div>
      </div>

      {/* FILTER */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Filter size={20} className="text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Bed Filter
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search bed number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-xl w-full"
              />
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border rounded-xl"
            >
              <option value="all">All</option>
              <option value="general">General Ward</option>
              <option value="icu">ICU</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

export default BedDashboard;
