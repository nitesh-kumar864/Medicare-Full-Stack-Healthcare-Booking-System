import {
  Settings,
  Save,
  RotateCcw,
} from "lucide-react";

const BedActions = ({
  handleSave,
  handleReset,
  resetIndividualBed,
  saving,
  resetting,
  selectedBed,
  setSelectedBed,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* CONFIGURATION ACTIONS */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <h3 className="font-bold text-lg text-gray-900 mb-6 flex items-center gap-2">
          <Settings size={20} className="text-gray-600" />
          Configuration Actions
        </h3>

        <div className="flex gap-4">
          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save All Configuration Changes
              </>
            )}
          </button>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            disabled={resetting}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-white to-gray-50 text-gray-800 font-semibold rounded-xl border border-gray-300 hover:border-red-300 hover:bg-red-50 hover:text-red-700 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {resetting ? (
              <>
                <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                Resetting...
              </>
            ) : (
              <>
                <RotateCcw size={18} />
                Reset All Beds (Clear All Bookings)
              </>
            )}
          </button>
        </div>
      </div>

      {/* INDIVIDUAL BED RESET */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Reset Specific Bed
            </label>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Enter bed number (e.g., 128, 205, 315)"
                  value={selectedBed}
                  onChange={(e) => setSelectedBed(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <button
                onClick={resetIndividualBed}
                disabled={!selectedBed}
                className="px-6 py-3.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset Bed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BedActions;
