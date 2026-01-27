import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import useRazorpay from "../payments/useRazorpay";
import { API } from "../config";

import { Clock, XCircle, CheckCircle } from "lucide-react";

import BookingDashboard from "../components/bed-bookings/BookingDashboard";
import BookingList from "../components/bed-bookings/BookingList";

const MyBedBookings = () => {
  const { token } = useContext(AppContext);

  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // ---------------- LOAD BOOKINGS ----------------
  const loadBookings = async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);

      const res = await axios.get(`${API}/api/bed/my-bookings`, {
        headers: { token },
      });

      setBookings(res.data.bookings || []);
    } catch (err) {
      toast.error("Failed to load bookings");
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  const { startBedPayment } = useRazorpay(API, token, loadBookings);

  // ---------------- CANCEL BOOKING ----------------
  const cancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      setLoading(true);

      await axios.post(
        `${API}/api/bed/cancel/${bookingId}`,
        {},
        { headers: { token } }
      );

      toast.success("Booking cancelled");

      loadBookings(true);

      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: "cancelled" } : b
        )
      );
    } catch {
      toast.error("Cancel failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;

    loadBookings(false);

    const interval = setInterval(() => {
      loadBookings(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [token]);

  // ---------------- HELPERS ----------------
  const isCancelled = (b) => b.status === "cancelled";
  const isPaid = (b) => b.payment === true && !isCancelled(b);

  // ---------------- STATS ----------------
  const total = bookings.length;
  const paid = bookings.filter(isPaid).length;
  const cancelled = bookings.filter(isCancelled).length;

  // ---------------- FILTERING ----------------
  const filteredBookings = bookings.filter((b) => {
    if (filter === "paid") return isPaid(b);
    if (filter === "cancelled") return isCancelled(b);
    return true;
  });

  // ---------------- STATUS BADGE ----------------
  const getStatusBadge = (b) => {
    const status =
      b.status === "cancelled"
        ? "cancelled"
        : b.payment
        ? "paid"
        : b.status === "locked"
        ? "unpaid"
        : b.status;

    const config = {
      unpaid: {
        text: "Unpaid",
        color: "bg-yellow-100 text-yellow-800 border-yellow-300",
        icon: <Clock size={16} />,
      },
      cancelled: {
        text: "Cancelled",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: <XCircle size={16} />,
      },
      paid: {
        text: "Paid",
        color: "bg-green-200 text-blue-800 border-blue-200",
        icon: <CheckCircle size={16} />,
      },
    };

    const current = config[status] || config.unpaid;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${current.color}`}
      >
        {current.icon}
        {current.text}
      </span>
    );
  };

  // ---------------- LOADING SCREEN ----------------
  if (loading) {
    return (
      <div className="pt-24 flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 px-4 md:px-8 bg-gradient-to-b from-gray-50 to-blue-50 min-h-screen pb-10">
      <BookingDashboard
        total={total}
        paid={paid}
        cancelled={cancelled}
        filter={filter}
        setFilter={setFilter}
      />

      <BookingList
        filteredBookings={filteredBookings}
        getStatusBadge={getStatusBadge}
        startBedPayment={startBedPayment}
        cancelBooking={cancelBooking}
        setLoading={setLoading}
      />
    </div>
  );
};

export default MyBedBookings;
