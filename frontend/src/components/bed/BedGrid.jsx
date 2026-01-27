const BedGrid = ({
  bedNumbers,
  occupiedList,
  lockedList,
  getBedType,
  BED_RANGES,
  handleSelectBed,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
        {bedNumbers.map((bedNumber) => {
          const isOccupied = occupiedList.includes(bedNumber);
          const isLocked = lockedList.includes(bedNumber);
          const isDisabled = isOccupied || isLocked;

          const bedType = getBedType(bedNumber);
          const typeConfig = BED_RANGES[bedType];

          return (
            <button
              key={bedNumber}
              disabled={isDisabled}
              onClick={() => handleSelectBed(bedNumber)}
              className={`relative p-4 rounded-xl text-sm flex flex-col items-center border transition
                ${isOccupied
                  ? typeConfig.occupiedBg
                  : isLocked
                    ? "bg-yellow-50 border-yellow-300 cursor-not-allowed"
                    : `${typeConfig.availableBg} hover:scale-105`
                }
              `}
            >
              <div className="font-bold text-lg">{bedNumber}</div>

              <div
                className={`px-2 py-1 text-xs rounded-full font-medium
                  ${isOccupied
                    ? "bg-red-100 text-red-700"
                    : isLocked
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }
                `}
              >
                {isOccupied
                  ? "Occupied"
                  : isLocked
                    ? "Locked"
                    : "Available"}
              </div>

              {bedType && (
                <div
                  className={`absolute -top-2 -right-2 w-6 h-6 rounded-full
                    text-white flex items-center justify-center
                    text-xs font-bold
                    ${typeConfig.badge}
                  `}
                >
                  {bedType[0].toUpperCase()}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BedGrid;
