import { useEffect, useState } from "react";

const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const useDoctorSlots = ({ docInfo, appointments }) => {
  const [docSlots, setDocSlots] = useState([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);

  /* ---------------- Generate time slots ---------------- */
  const generateTimeSlots = (startTime = "10:00", endTime = "21:30") => {
    const slots = [];
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);

    const current = new Date("2000-01-01T00:00:00");
    current.setHours(startH, startM, 0, 0);

    const end = new Date("2000-01-01T00:00:00");
    end.setHours(endH, endM, 0, 0);

    while (current <= end) {
      const hr = current.getHours();
      const min = current.getMinutes().toString().padStart(2, "0");
      const ampm = hr >= 12 ? "PM" : "AM";

      slots.push(`${hr % 12 || 12}:${min} ${ampm}`);
      current.setMinutes(current.getMinutes() + 30);
    }

    return slots;
  };

  /* ---------------- Create 7 days of slots ---------------- */
  useEffect(() => {
    if (!docInfo) return;

    const today = new Date();
    const slotsArr = [];

    for (let i = 0; i < 7; i++) {
      const dateObj = new Date(today);
      dateObj.setDate(today.getDate() + i);

      const normalizedDate = new Date(
        dateObj.getFullYear(),
        dateObj.getMonth(),
        dateObj.getDate(),
        0,
        0,
        0
      );

      slotsArr.push({
        day: daysOfWeek[normalizedDate.getDay()],
        date: normalizedDate.getDate(),
        fullDate: normalizedDate.toISOString(),
        timeSlots: generateTimeSlots("10:00", "21:30"),
      });
    }

    setDocSlots(slotsArr);
    setSelectedDayIndex(0);
    setSelectedTime(null);
  }, [docInfo]);

  if (!docInfo || docSlots.length === 0) {
    return {
      docSlots,
      selectedDayIndex,
      selectedTime,
      visibleTimeSlots: [],
      lockedSlots: [],
      hasPendingSameDate: false,
      setSelectedDayIndex,
      setSelectedTime,
    };
  }

  /* ---------------- Selected day info ---------------- */
  const selectedDay = docSlots[selectedDayIndex];
  const selectedDateObj = new Date(selectedDay.fullDate);

  const slotDate = `${selectedDateObj.getDate()}_${selectedDateObj.getMonth() + 1
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


/* ---------------- Filter visible time slots ---------------- */

const visibleTimeSlots = selectedDay.timeSlots.filter((slot) => {
  const slotDateObj = new Date(selectedDay.fullDate);

  const [time, ampm] = slot.split(" ");
  let [hour, minute] = time.split(":").map(Number);

  // Convert 12-hour time to 24-hour time
  if (ampm === "PM" && hour !== 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;

  slotDateObj.setHours(hour, minute, 0, 0);

  const now = new Date();

  // Hide past slots and slots starting within the next 30 minutes
  const minimumAllowedTime = new Date(
    now.getTime() + 30 * 60 * 1000
  );

  if (slotDateObj <= minimumAllowedTime) {
    return false;
  }

  // Hide already booked slots
  if (bookedSlots.includes(slot)) {
    return false;
  }

  // Keep future unavailable and locked slots visible
  return true;
});

  return {
    docSlots,
    selectedDayIndex,
    selectedTime,
    visibleTimeSlots,
    lockedSlots,
    hasPendingSameDate,
    setSelectedDayIndex,
    setSelectedTime,
  };
};

export default useDoctorSlots;
