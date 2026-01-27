import {
  Users,
  HeartPulse,
  AlertCircle,
} from "lucide-react";

const WardConfiguration = ({
  config,
  stats,
  handleChange,
  calculateProgressWidth,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* GENERAL WARD */}
      <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white border border-blue-200 rounded-xl shadow-sm">
              <Users className="text-blue-600" size={22} />
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {stats.generalOccupied}
              <span className="text-gray-400">/{config.generalTotal}</span>
            </div>
            <div className="text-xs text-gray-500">Occupied/Total</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Capacity Usage</span>
            <span className="font-medium text-gray-900">
              {config.generalTotal > 0
                ? Math.round(
                    (stats.generalOccupied / config.generalTotal) * 100
                  )
                : 0}
              %
            </span>
          </div>
          <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
              style={{
                width: `${calculateProgressWidth(
                  stats.generalOccupied,
                  config.generalTotal
                )}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Configure Total Beds
            </label>
            <input
              type="number"
              name="generalTotal"
              value={config.generalTotal}
              onChange={handleChange}
              min="0"
              max="100"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Enter total beds"
            />
          </div>
        </div>
      </div>

      {/* ICU WARD */}
      <div className="bg-gradient-to-br from-red-50 to-white rounded-2xl p-6 border border-red-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white border border-red-200 rounded-xl shadow-sm">
              <HeartPulse className="text-red-600" size={22} />
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {stats.icuOccupied}
              <span className="text-gray-400">/{config.icuTotal}</span>
            </div>
            <div className="text-xs text-gray-500">Occupied/Total</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Capacity Usage</span>
            <span className="font-medium text-gray-900">
              {config.icuTotal > 0
                ? Math.round((stats.icuOccupied / config.icuTotal) * 100)
                : 0}
              %
            </span>
          </div>
          <div className="h-2 bg-red-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500"
              style={{
                width: `${calculateProgressWidth(
                  stats.icuOccupied,
                  config.icuTotal
                )}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Configure Total Beds
            </label>
            <input
              type="number"
              name="icuTotal"
              value={config.icuTotal}
              onChange={handleChange}
              min="0"
              max="20"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
              placeholder="Enter total beds"
            />
          </div>
        </div>
      </div>

      {/* EMERGENCY WARD */}
      <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-6 border border-amber-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white border border-amber-200 rounded-xl shadow-sm">
              <AlertCircle className="text-amber-600" size={22} />
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {stats.emergencyOccupied}
              <span className="text-gray-400">
                /{config.emergencyTotal}
              </span>
            </div>
            <div className="text-xs text-gray-500">Occupied/Total</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Capacity Usage</span>
            <span className="font-medium text-gray-900">
              {config.emergencyTotal > 0
                ? Math.round(
                    (stats.emergencyOccupied /
                      config.emergencyTotal) *
                      100
                  )
                : 0}
              %
            </span>
          </div>
          <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500"
              style={{
                width: `${calculateProgressWidth(
                  stats.emergencyOccupied,
                  config.emergencyTotal
                )}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Configure Total Beds
            </label>
            <input
              type="number"
              name="emergencyTotal"
              value={config.emergencyTotal}
              onChange={handleChange}
              min="0"
              max="20"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
              placeholder="Enter total beds"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WardConfiguration;
