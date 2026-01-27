import React from "react";

const SlotBooking = ({
  docInfo,
  docSlots,
  selectedDayIndex,
  setSelectedDayIndex,
  selectedTime,
  setSelectedTime,
  bookingLoading,
  bookAppointment,
  appointments,
}) => {
  /* ---------------- Prepare selected day ---------------- */
  const selectedDay = docSlots[selectedDayIndex];
  const selectedDateObj = new Date(selectedDay.fullDate);

  const slotDate = `${selectedDateObj.getDate()}_${
    selectedDateObj.getMonth() + 1
  }_${selectedDateObj.getFullYear()}`;

  const bookedSlots = Array.isArray(docInfo?.slots_booked)
    ? docInfo.slots_booked
        .filter((s) => s.date === slotDate)
        .map((s) => s.time)
    : [];

  const lockedSlots = Array.isArray(docInfo?.slots_locked)
    ? docInfo.slots_locked
        .filter((s) => s.date === slotDate)
        .map((s) => s.time)
    : [];

  const hasPendingSameDate = appointments.some(
    (a) =>
      String(a.docId) === String(docInfo._id) &&
      a.slotDate === slotDate &&
      !a.payment &&
      !a.cancelled
  );

  /* ---------------- Visible slots ---------------- */
  const visibleTimeSlots = selectedDay.timeSlots.filter((slot) => {
    if (bookedSlots.includes(slot)) return false;

    const slotDateObj = new Date(selectedDay.fullDate);

    let [time, ampm] = slot.split(" ");
    let [h, m] = time.split(":").map(Number);

    if (ampm === "PM" && h !== 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;

    slotDateObj.setHours(h, m, 0, 0);

    const now = new Date();

    if (
      slotDateObj.toDateString() === now.toDateString() &&
      slotDateObj <= new Date(now.getTime() + 30 * 60000)
    ) {
      return false;
    }

    return true;
  });

  return (
    <>
      {/* ---------- Booking Slots ---------- */}
      {docInfo.available ? (
        <div className="sm:ml-72 sm:pl-4 mt-6">
          <p className="font-medium text-gray-700">Booking Slots</p>

          {/* Day Selection */}
          <div className="flex gap-3 overflow-x-auto mt-3">
            {docSlots.map((day, i) => (
              <div
                key={i}
                onClick={() => {
                  setSelectedDayIndex(i);
                  setSelectedTime(null);
                }}
                className={`text-center py-5 px-4 min-w-16 rounded-full cursor-pointer ${
                  selectedDayIndex === i
                    ? "bg-primary text-white"
                    : "border border-gray-300"
                }`}
              >
                <p>{day.day}</p>
                <p>{day.date}</p>
              </div>
            ))}
          </div>

          {/* Time Selection */}
          <div className="flex gap-3 overflow-x-auto mt-3">
            {hasPendingSameDate ? (
              <p className="text-sm text-red-500 mt-2">
                You already have a pending appointment for this date.
                Please complete or cancel it first.
              </p>
            ) : visibleTimeSlots.length > 0 ? (
              visibleTimeSlots.map((slot, idx) => {
                const isLocked = lockedSlots.includes(slot);

                return (
                  <p
                    key={idx}
                    onClick={() => {
                      if (!isLocked) setSelectedTime(slot);
                    }}
                    className={`px-4 py-2 min-w-24 h-10 flex-shrink-0 flex items-center justify-center rounded-full text-sm
                      ${
                        isLocked
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : selectedTime === slot
                          ? "bg-primary text-white"
                          : "border border-gray-300 text-gray-600 cursor-pointer"
                      }
                    `}
                  >
                    {slot}
                    {isLocked && (
                      <span className="ml-1 text-xs">(In progress)</span>
                    )}
                  </p>
                );
              })
            ) : (
              <p className="text-sm text-gray-500">
                Booking for today is closed. Please select another date.
              </p>
            )}
          </div>

          {/* Book Button */}
          <button
            onClick={() => bookAppointment(slotDate, selectedTime)}
            disabled={bookingLoading}
            className={`bg-primary text-white text-sm px-14 py-3 rounded-full mt-6 ${
              bookingLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {bookingLoading ? "Booking..." : "Book Appointment"}
          </button>
        </div>
      ) : (
        <p className="text-red-500 text-center font-medium mt-8">
          This doctor is currently not available.
        </p>
      )}
    </>
  );
};

export default SlotBooking;
