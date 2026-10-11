
import doctorModel from "../../models/doctorModel.js";

// Validate the existing date format: DD_MM_YYYY
const isValidDate = (date) => {
  if (typeof date !== "string") return false;

  const match = date.match(/^(\d{1,2})_(\d{1,2})_(\d{4})$/);
  if (!match) return false;

  const [, day, month, year] = match;
  const d = Number(day);
  const m = Number(month);
  const y = Number(year);

  const parsed = new Date(y, m - 1, d);

  return (
    parsed.getFullYear() === y &&
    parsed.getMonth() === m - 1 &&
    parsed.getDate() === d
  );
};


const isValidTime = (time) =>
  typeof time === "string" &&
  /^(0?[1-9]|1[0-2]):[0-5]\d (AM|PM)$/.test(time);

// BLOCK ONE SLOT
export const blockDoctorSlotService = async ({
  doctorId,
  date,
  time,
}) => {
  if (!doctorId || !isValidDate(date) || !isValidTime(time)) {
    return {
      success: false,
      status: 400,
      message: "Valid doctor ID, date, and time are required",
    };
  }

  const doctor = await doctorModel.findById(doctorId);

  if (!doctor) {
    return {
      success: false,
      status: 404,
      message: "Doctor not found",
    };
  }

  if (!doctor.available) {
    return {
      success: false,
      status: 400,
      message: "Doctor is globally unavailable",
    };
  }

  const alreadyBooked = doctor.slots_booked.some(
    (slot) => slot.date === date && slot.time === time
  );

  if (alreadyBooked) {
    return {
      success: false,
      status: 409,
      message: "This slot already has a booking",
    };
  }

  const isLocked = doctor.slots_locked.some(
    (slot) => slot.date === date && slot.time === time
  );

  if (isLocked) {
    return {
      success: false,
      status: 409,
      message: "This slot is temporarily locked",
    };
  }

  const isDayBlocked = doctor.unavailableDates.some(
    (item) => item.date === date
  );

  if (isDayBlocked) {
    return {
      success: false,
      status: 409,
      message: "This entire date is already unavailable",
    };
  }

  const alreadyBlocked = doctor.unavailableSlots.some(
    (slot) => slot.date === date && slot.time === time
  );

  if (alreadyBlocked) {
    return {
      success: true,
      message: "This slot is already blocked",
    };
  }

  doctor.unavailableSlots.push({ date, time });
  await doctor.save();

  return {
    success: true,
    message: "Appointment slot blocked successfully",
    unavailableSlots: doctor.unavailableSlots,
  };
};

// UNBLOCK ONE SLOT
export const unblockDoctorSlotService = async ({
  doctorId,
  date,
  time,
}) => {
  if (!doctorId || !isValidDate(date) || !isValidTime(time)) {
    return {
      success: false,
      status: 400,
      message: "Valid doctor ID, date, and time are required",
    };
  }

  const doctor = await doctorModel.findById(doctorId);

  if (!doctor) {
    return {
      success: false,
      status: 404,
      message: "Doctor not found",
    };
  }

  const originalLength = doctor.unavailableSlots.length;

  doctor.unavailableSlots = doctor.unavailableSlots.filter(
    (slot) => !(slot.date === date && slot.time === time)
  );

  if (doctor.unavailableSlots.length === originalLength) {
    return {
      success: false,
      status: 404,
      message: "Blocked slot not found",
    };
  }

  await doctor.save();

  return {
    success: true,
    message: "Appointment slot unblocked successfully",
    unavailableSlots: doctor.unavailableSlots,
  };
};

// BLOCK AN ENTIRE DATE
export const blockDoctorDateService = async ({
  doctorId,
  date,
}) => {
  if (!doctorId || !isValidDate(date)) {
    return {
      success: false,
      status: 400,
      message: "Valid doctor ID and date are required",
    };
  }

  const doctor = await doctorModel.findById(doctorId);

  if (!doctor) {
    return {
      success: false,
      status: 404,
      message: "Doctor not found",
    };
  }

  if (!doctor.available) {
    return {
      success: false,
      status: 400,
      message: "Doctor is globally unavailable",
    };
  }

  const alreadyBlocked = doctor.unavailableDates.some(
    (item) => item.date === date
  );

  if (alreadyBlocked) {
    return {
      success: true,
      message: "This date is already blocked",
    };
  }

  doctor.unavailableDates.push({ date });
  await doctor.save();

  return {
    success: true,
    message: "Entire date blocked successfully",
    unavailableDates: doctor.unavailableDates,
  };
};

// UNBLOCK AN ENTIRE DATE
export const unblockDoctorDateService = async ({
  doctorId,
  date,
}) => {
  if (!doctorId || !isValidDate(date)) {
    return {
      success: false,
      status: 400,
      message: "Valid doctor ID and date are required",
    };
  }

  const doctor = await doctorModel.findById(doctorId);

  if (!doctor) {
    return {
      success: false,
      status: 404,
      message: "Doctor not found",
    };
  }

  const originalLength = doctor.unavailableDates.length;

  doctor.unavailableDates = doctor.unavailableDates.filter(
    (item) => item.date !== date
  );

  if (doctor.unavailableDates.length === originalLength) {
    return {
      success: false,
      status: 404,
      message: "Blocked date not found",
    };
  }

  await doctor.save();

  return {
    success: true,
    message: "Date unblocked successfully",
    unavailableDates: doctor.unavailableDates,
  };
};
