import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import useRazorpay from "../payments/useRazorpay";

const useAppointmentCore = ({
  docId,
  doctors,
  backendUrl,
  token,
  getDoctorsData,
  userData,
  navigate,
}) => {
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [reviewList, setReviewList] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [appointments, setAppointments] = useState([]);

  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingAppointmentId, setPendingAppointmentId] = useState(null);

  const { startPayment } = useRazorpay(backendUrl, token, async () => {
    await fetchUserAppointments();
    await getDoctorsData();
  });

  /* ---------------- Fetch Doctors ---------------- */
  useEffect(() => {
    if ((!doctors || doctors.length === 0) && getDoctorsData) {
      getDoctorsData();
    }
  }, [doctors, getDoctorsData]);

  /* ---------------- Find Selected Doctor ---------------- */
  useEffect(() => {
    if (!doctors || doctors.length === 0) return;
    const found = doctors.find((d) => d._id === docId);
    setDocInfo(found || null);
  }, [doctors, docId]);

  /* ---------------- Auto Refresh ---------------- */
  useEffect(() => {
    if (!docInfo) return;
    const interval = setInterval(() => getDoctorsData(), 30000);
    return () => clearInterval(interval);
  }, [docInfo, getDoctorsData]);

  /* ---------------- Time Slot Generator ---------------- */
  const generateTimeSlots = (startTime = "10:00", endTime = "21:30") => {
    const slots = [];

    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);

    const cur = new Date(2000, 0, 1, sh, sm, 0, 0);
    const end = new Date(2000, 0, 1, eh, em, 0, 0);

    while (cur <= end) {
      const hr = cur.getHours();
      const min = String(cur.getMinutes()).padStart(2, "0");
      const ampm = hr >= 12 ? "PM" : "AM";

      slots.push(`${hr % 12 || 12}:${min} ${ampm}`);

      cur.setMinutes(cur.getMinutes() + 30);
    }

    return slots;
  };

  /* ---------------- Create Slots ---------------- */
  useEffect(() => {
    if (!docInfo) return;

    const today = new Date();
    const slotsArr = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      // Local calendar date ko preserve karein
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");

      slotsArr.push({
        day: daysOfWeek[d.getDay()],
        date: d.getDate(),
        fullDate: `${year}-${month}-${day}T00:00:00`,
        timeSlots: generateTimeSlots("10:00", "21:30"),
      });
    }

    setDocSlots(slotsArr);
    setSelectedDayIndex(0);
    setSelectedTime(null);
  }, [docInfo?._id]);

  /* ---------------- Appointments ---------------- */
  const fetchUserAppointments = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/user/appointments`,
        { headers: { token } }
      );
      if (data.success) setAppointments(data.appointments);
    } catch (err) {
      console.log(err.data?.message || err.message);
    }
  };

  useEffect(() => {
    if (token) fetchUserAppointments();
  }, [token]);

  /* ---------------- Reviews ---------------- */
  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/reviews/doctor/${docId}`
      );
      if (data.success) setReviewList(data.reviews);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [docId]);

  /* ---------------- Review CRUD ---------------- */
  const submitReview = async () => {
    if (!token) {
      return navigate("/login", {
        state: { from: `/appointments/${docId}` },
      });
    }

    if (rating === 0) {
      return toast.error("Please give a rating");
    }

    const completed = appointments.find(
      (a) => String(a.docId) === String(docId) && a.payment
    );

    if (!completed) {
      return toast.error("Complete appointment before review");
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/reviews/add`,
        {
          doctorId: docId,
          appointmentId: completed._id,
          rating,
          comment,
        },
        { headers: { token } }
      );

      if (!data.success) {
        return toast.error(data.message);
      }

      toast.success(data.message);

      setRating(0);
      setComment("");
      fetchReviews();

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit review"
      );
    }
  };

  const editReview = async (id, r, c) => {
    await axios.put(
      `${backendUrl}/api/reviews/update/${id}`,
      { rating: r, comment: c },
      { headers: { token } }
    );
    fetchReviews();
  };

  const deleteReview = async (id) => {
    await axios.delete(
      `${backendUrl}/api/reviews/delete/${id}`,
      { headers: { token } }
    );
    fetchReviews();
  };

  const isProfileComplete = () => {
    if (!userData) return false;

    const { phone, gender, dob } = userData;

    if (
      !phone ||
      phone.length == "0000000000" ||
      gender === "Not selected" ||
      !gender ||
      dob === "Not selected" ||
      !dob
    ) {
      return false;
    }

    return true;
  };

  /* ---------------- Book Appointment ---------------- */

  const bookAppointment = async (slotDate, slotTime) => {
    if (!token) {
      return navigate("/login", {
        state: { from: `/appointments/${docId}` },
      });
    }

    if (!selectedTime || !slotTime) {
      return toast.error("Select a time slot");
    }

    if (!docInfo) {
      return toast.error("Doctor information is unavailable");
    }

    if (!docInfo.available) {
      return toast.error("This doctor is currently unavailable");
    }

    const unavailableDates = Array.isArray(docInfo.unavailableDates)
      ? docInfo.unavailableDates
      : [];

    const unavailableSlots = Array.isArray(docInfo.unavailableSlots)
      ? docInfo.unavailableSlots
      : [];

    if (unavailableDates.some((item) => item.date === slotDate)) {
      return toast.error("The doctor is unavailable on this date");
    }

    if (
      unavailableSlots.some(
        (item) => item.date === slotDate && item.time === slotTime
      )
    ) {
      return toast.error("This appointment slot is unavailable");
    }

    if (
      docInfo.slots_booked?.some(
        (item) => item.date === slotDate && item.time === slotTime
      )
    ) {
      return toast.error("This appointment slot has already been booked");
    }

    if (
      docInfo.slots_locked?.some(
        (item) => item.date === slotDate && item.time === slotTime
      )
    ) {
      return toast.error("This appointment slot is temporarily locked");
    }

    if (!isProfileComplete()) {
      toast.error("Complete your profile before booking.");
      navigate("/my-profile", {
        state: { returnTo: `/appointments/${docId}` },
      });
      return;
    }

    setBookingLoading(true);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime },
        { headers: { token } }
      );

      if (!data.success) {
        toast.error(data.message || "Unable to book appointment");
        return;
      }

      setPendingAppointmentId(data.appointmentId);
      setShowConfirm(true);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Unable to book appointment. Please try again."
      );
    } finally {
      setBookingLoading(false);
    }
  };


  const handleConfirmPayment = () => {
    setShowConfirm(false);
    startPayment(pendingAppointmentId, setBookingLoading);
  };

  const handleCancelPayment = () => setShowConfirm(false);

  return {
    docInfo,
    docSlots,
    selectedDayIndex,
    selectedTime,
    bookingLoading,
    reviewList,
    rating,
    comment,
    appointments,
    showConfirm,

    setSelectedDayIndex,
    setSelectedTime,
    setRating,
    setComment,

    submitReview,
    editReview,
    deleteReview,
    bookAppointment,
    handleConfirmPayment,
    handleCancelPayment,
  };
};

export default useAppointmentCore;
