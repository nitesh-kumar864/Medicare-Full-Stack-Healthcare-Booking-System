
import React from "react";

const SlotBooking = ({
  docInfo,
  docSlots = [],
  selectedDayIndex,
  setSelectedDayIndex,
  selectedTime,
  setSelectedTime,
  bookingLoading,
  bookAppointment,
  appointments = [],
}) => {

  const selectedDay = docSlots[selectedDayIndex];

  // Prevent errors while slots are loading
  if (!selectedDay || !docInfo) {
    return (
      <p className="mt-6 text-center text-gray-500">
        Loading appointment availability...
      </p>
    );
  }

  // Format date as DD_MM_YYYY
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()}_${d.getMonth() + 1}_${d.getFullYear()}`;
  };

  const slotDate = formatDate(selectedDay.fullDate);

  // Normalize times so "02:30 PM" and "2:30 PM" match
  const normalizeTime = (time = "") => {
    const [timePart, ampm] = time.trim().split(/\s+/);
    const [hour, minute] = timePart.split(":");

    return `${Number(hour)}:${minute} ${ampm?.toUpperCase()}`;
  };

  // Always initialize arrays before using them
  const unavailableDates = Array.isArray(docInfo.unavailableDates)
    ? docInfo.unavailableDates
    : [];

  const unavailableSlots = Array.isArray(docInfo.unavailableSlots)
    ? docInfo.unavailableSlots
    : [];

  const bookedSlots = Array.isArray(docInfo.slots_booked)
    ? docInfo.slots_booked
      .filter((s) => s.date === slotDate)
      .map((s) => s.time)
    : [];

  const lockedSlots = Array.isArray(docInfo.slots_locked)
    ? docInfo.slots_locked
      .filter((s) => s.date === slotDate)
      .map((s) => s.time)
    : [];

  // Check full-day unavailability
  const isDayBlocked = unavailableDates.some(
    (item) => item.date === slotDate
  );

  // Check individual blocked slots
  const isSlotBlocked = (slot) =>
    unavailableSlots.some(
      (item) =>
        item.date === slotDate &&
        normalizeTime(item.time) === normalizeTime(slot)
    );

  // Check pending appointments
  const hasPendingSameDate = appointments.some(
    (a) =>
      String(a.docId?._id || a.docId) === String(docInfo._id) &&
      a.slotDate === slotDate &&
      !a.payment &&
      !a.cancelled
  );

  // Hide booked and past slots, but keep manually blocked
  // and locked slots visible so users can see their status.
  const visibleTimeSlots = selectedDay.timeSlots.filter((slot) => {
    if (bookedSlots.some(
      (time) => normalizeTime(time) === normalizeTime(slot)
    )) {
      return false;
    }

    if (isSlotBlocked(slot) || lockedSlots.some(
      (time) => normalizeTime(time) === normalizeTime(slot)
    )) {
      return true;
    }

    const slotDateObj = new Date(selectedDay.fullDate);
    const [timePart, ampm] = slot.split(" ");
    let [hour, minute] = timePart.split(":").map(Number);

    if (ampm === "PM" && hour !== 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;

    slotDateObj.setHours(hour, minute, 0, 0);

    const now = new Date();

    if (
      slotDateObj.toDateString() === now.toDateString() &&
      slotDateObj <= new Date(now.getTime() + 30 * 60000)
    ) {
      return false;
    }

    return true;
  });

  // Determine whether booking is allowed
  const canBook =
    Boolean(selectedTime) &&
    !bookingLoading &&
    !isDayBlocked &&
    !isSlotBlocked(selectedTime) &&
    !bookedSlots.some(
      (time) => normalizeTime(time) === normalizeTime(selectedTime)
    ) &&
    !lockedSlots.some(
      (time) => normalizeTime(time) === normalizeTime(selectedTime)
    ) &&
    !hasPendingSameDate;


  return (
    <>
      {docInfo.available ? (
        <div className="sm:ml-72 sm:pl-4 mt-6">
          <p className="font-medium text-gray-700">
            Booking Slots
          </p>

          {/* Date selection */}
          <div className="flex gap-3 overflow-x-auto mt-3">
            {docSlots.map((day, index) => {
              const date = formatDate(day.fullDate);

              const blocked = unavailableDates.some(
                (item) => item.date === date
              );

              return (
                <button
                  type="button"
                  key={date}
                  onClick={() => {
                    setSelectedDayIndex(index);
                    setSelectedTime(null);
                  }}
                  className={`text-center py-5 px-4 min-w-16 rounded-full border ${selectedDayIndex === index
                      ? "bg-primary text-white"
                      : blocked
                        ? "border-red-300 text-red-600"
                        : "border-gray-300 text-gray-700"
                    }`}
                >
                  <span className="block">{day.day}</span>
                  <span className="block">{day.date}</span>

                  {blocked && (
                    <span className="block text-xs mt-1">
                      Unavailable
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Availability status */}
          {isDayBlocked ? (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3 mt-4">
              This entire date is unavailable. Please select another date.
            </p>
          ) : hasPendingSameDate ? (
            <p className="text-sm text-red-500 mt-4">
              You already have a pending appointment for this date.
              Please complete or cancel it first.
            </p>
          ) : (
            <>
              {/* Time slots */}
              <div className="flex flex-wrap gap-3 mt-4">
                {visibleTimeSlots.length > 0 ? (
                  visibleTimeSlots.map((slot) => {
                    const isLocked = lockedSlots.includes(slot);
                    const isBlocked = isSlotBlocked(slot);
                    const disabled = isLocked || isBlocked;

                    return (
                      <button
                        type="button"
                        key={slot}
                        disabled={disabled}
                        onClick={() => setSelectedTime(slot)}
                        aria-pressed={selectedTime === slot}
                        className={`px-4 py-2 min-w-24 min-h-10 rounded-full text-sm border ${isBlocked
                            ? "bg-red-100 border-red-300 text-red-600 cursor-not-allowed"
                            : isLocked
                              ? "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed"
                              : selectedTime === slot
                                ? "bg-primary text-white"
                                : "border-gray-300 text-gray-600"
                          }`}
                      >
                        <span>{slot}</span>

                        {isBlocked && (
                          <span className="block text-xs">
                            Unavailable
                          </span>
                        )}

                        {isLocked && (
                          <span className="block text-xs">
                            In progress
                          </span>
                        )}
                      </button>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500">
                    No future appointment slots are available for this date.
                  </p>
                )}
              </div>
            </>
          )}

          {/* Booking button */}
          <button
            type="button"
            onClick={() => {
              if (canBook) {
                bookAppointment(slotDate, selectedTime);
              }
            }}
            disabled={!canBook}
            className={`bg-primary text-white text-sm px-14 py-3 rounded-full mt-6 ${!canBook ? "opacity-50 cursor-not-allowed" : ""
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
