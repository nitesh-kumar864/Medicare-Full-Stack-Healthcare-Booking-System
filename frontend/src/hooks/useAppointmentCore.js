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
    const interval = setInterval(() => getDoctorsData(), 5000);
    return () => clearInterval(interval);
  }, [docInfo, getDoctorsData]);

  /* ---------------- Time Slot Generator ---------------- */
  const generateTimeSlots = (startTime = "10:00", endTime = "21:00") => {
    const slots = [];
    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);

    const cur = new Date("2000-01-01T00:00");
    cur.setHours(sh, sm, 0, 0);

    const end = new Date("2000-01-01T00:00");
    end.setHours(eh, em, 0, 0);

    while (cur <= end) {
      const hr = cur.getHours();
      const min = cur.getMinutes().toString().padStart(2, "0");
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

      slotsArr.push({
        day: daysOfWeek[d.getDay()],
        date: d.getDate(),
        fullDate: d.toISOString(),
        timeSlots: generateTimeSlots(),
      });
    }

    setDocSlots(slotsArr);
    setSelectedDayIndex(0);
    setSelectedTime(null);
  }, [docInfo]);

  /* ---------------- Appointments ---------------- */
  const fetchUserAppointments = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/user/appointments`,
        { headers: { token } }
      );
      if (data.success) setAppointments(data.appointments);
    } catch { }
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
    } catch { }
  };

  useEffect(() => {
    fetchReviews();
  }, [docId]);

  /* ---------------- Review CRUD ---------------- */
  const submitReview = async () => {
    if (!token) return navigate("/login");
    if (rating === 0) return toast.error("Please give a rating");

    const completed = appointments.find(
      (a) => String(a.docId) === String(docId) && a.payment
    );

    if (!completed)
      return toast.error("Complete appointment before review");

    await axios.post(
      `${backendUrl}/api/reviews/add`,
      {
        doctorId: docId,
        appointmentId: completed._id,
        rating,
        comment,
      },
      { headers: { token } }
    );

    setRating(0);
    setComment("");
    fetchReviews();
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

    const { phone, gender, dob, address } = userData;

    return (
      phone &&
      gender &&
      dob
    );
  };

  /* ---------------- Book Appointment ---------------- */
  const bookAppointment = async (slotDate, slotTime) => {
    if (!token) return navigate("/login");
    if (!selectedTime) return toast.error("Select time slot");
    if (!isProfileComplete()) {
    toast.error("Please complete your profile before booking.");
    navigate("/my-profile");
    return;
  }
    setBookingLoading(true);

    const { data } = await axios.post(
      `${backendUrl}/api/user/book-appointment`,
      { docId, slotDate, slotTime },
      { headers: { token } }
    );

    if (data.success) {
      setPendingAppointmentId(data.appointmentId);
      setShowConfirm(true);
    }

    setBookingLoading(false);
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
    handleEditReview: editReview,
    handleDeleteReview: deleteReview,
    bookAppointment,
    handleConfirmPayment,
    handleCancelPayment,
  };
};

export default useAppointmentCore;
