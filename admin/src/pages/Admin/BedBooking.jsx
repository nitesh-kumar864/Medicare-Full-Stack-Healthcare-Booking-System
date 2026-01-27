import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

const BedBooking = () => {
  const { backendUrl, aToken } = useContext(AdminContext);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${backendUrl}/api/bed/admin/bookings`,
        { headers: { atoken: aToken } }
      );

      const sortedBookings = (res.data.bookings || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setBookings(sortedBookings);
    } catch (err) {
      toast.error("Failed to load bed bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (aToken) {
      fetchBookings();
    }
  }, [aToken]);

  const cancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      setLoading(true);

      const res = await axios.post(
        `${backendUrl}/api/bed/admin/cancel/${id}`,
        {},
        { headers: { atoken: aToken } }
      );

      toast.success(res.data.message || "Cancelled");
      fetchBookings();
    } catch (err) {
      toast.error("Failed to cancel booking");
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === "All") return true;
    return b.status.toLowerCase() === statusFilter.toLowerCase();
  });

  if (loading) {
    return (
      <Loader
        title="Loading Bed Bookings"
        subtitle="Fetching bed reservation data..."
      />
    );
  }

  return (
    <div className="w-full max-w-6xl m-5">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-lg font-medium">All Bed Bookings</p>

        {/* STATUS FILTER */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          <option value="All">All</option>
          <option value="booked">Booked</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white border rounded-xl text-sm max-h-[80vh] overflow-y-auto">

        {/* HEADER ROW */}
        <div className="hidden sm:grid grid-cols-[0.5fr_2.5fr_2fr_3fr_1.5fr_2fr_1.5fr_1fr] px-6 py-3 border-b font-medium text-gray-600">
          <p>#</p>
          <p>Patient</p>
          <p>Phone</p>
          <p>Email</p>
          <p>Bed Type</p>
          <p>Date</p>
          <p>Status</p>
          <p>Action</p>
        </div>

        {/* ROWS */}
        {filteredBookings.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No bed bookings yet.
          </div>
        )}

        {filteredBookings.map((b, index) => (

          <div
            key={b._id}
            className="border-b px-4 py-4 hover:bg-gray-50"
          >

            {/* MOBILE VIEW */}
            <div className="sm:hidden flex flex-col gap-2">
              <p className="font-medium text-gray-800">{b.name}</p>
              <p className="text-xs text-gray-500">{b.phone}</p>
              <p className="text-xs text-gray-500">{b.email}</p>

              <p className="text-sm">
                <span className="font-medium">Bed:</span>{" "}
                {b.bedType}
              </p>

              <p className="text-sm">
                <span className="font-medium">Date:</span>{" "}
                {formatDateTime(b.createdAt)}
              </p>

              <div className="flex items-center gap-3 mt-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold
                  ${b.status === "booked"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                    }`}
                >
                  {b.status}
                </span>

                {b.status === "booked" && (
                  <button
                    onClick={() => cancelBooking(b._id)}
                    className="text-red-600 text-sm underline"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* DESKTOP VIEW */}
            <div className="hidden sm:grid grid-cols-[0.5fr_2.5fr_2fr_3fr_1.5fr_2fr_1.5fr_1fr] items-center gap-1 text-gray-600">

              <p>{bookings.length - index}</p>

              <p className="font-medium text-gray-800">{b.name}</p>

              <p>{b.phone}</p>
              <p>{b.email}</p>

              <p className="capitalize">{b.bedType}</p>
              <p>{formatDateTime(b.createdAt)}</p>

              <span
                className={`w-fit px-3 py-1 rounded-full text-xs font-semibold
                ${b.status === "booked"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                  }`}
              >
                {b.status}
              </span>

              {b.status === "booked" ? (
                <button
                  onClick={() => cancelBooking(b._id)}
                  className="text-red-600 hover:underline"
                >
                  Cancel
                </button>
              ) : (
                <span className="text-gray-400 text-xs">
                  No action
                </span>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default BedBooking;
