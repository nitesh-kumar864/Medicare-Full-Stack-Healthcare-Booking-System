import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import Loader from "../../components/Loader";

const AllAppointment = () => {
  const {
    aToken,
    appointments,
    getAllAppointments,
    cancelAppointment,
  } = useContext(AdminContext);

  const { calculateAge, slotDateFormat } = useContext(AppContext);
  const [pageLoading, setPageLoading] = useState(true);

  //  Status Filter + Pagination States
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  //  Filter by Status
  const filteredAppointments = appointments.filter((item) => {
    if (statusFilter === "All") return true;

    if (statusFilter === "Completed") {
      return (
        (item.payment || item.isCompleted) &&
        !item.cancelled
      );
    }

    if (statusFilter === "Cancelled") {
      return item.cancelled;
    }

    if (statusFilter === "Pending") {
      return (
        !item.payment &&
        !item.isCompleted &&
        !item.cancelled
      );
    }

    return true;
  });

  //  Pagination
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Fetch All Appointments
  useEffect(() => {
    if (aToken) {
      setPageLoading(true);
      getAllAppointments().finally(() => {
        setPageLoading(false);
      });
    }
  }, [aToken]);

  // Loader
  if (pageLoading) {
    return (
      <Loader
        title="Loading Appointments"
        subtitle="Fetching appointment records..."
      />
    );
  }

  if (!pageLoading && appointments.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        No appointments found
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl m-5">

      {/*  HEADER + FILTER */}
      <div className="flex justify-between items-center mb-3">
        <p className="text-lg font-medium">All Appointments</p>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1); // reset to first page
          }}
          className="border px-3 py-1 rounded"
        >
          <option value="All">All</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {/* MAIN TABLE */}
      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">

        {/* TABLE HEADER */}
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_1fr_3fr_3fr_1fr_1fr] py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Gender</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {/* TABLE ROWS */}
        {paginatedAppointments.map((item, index) => (
          <div key={index} className="border-b py-4 px-4 hover:bg-gray-50">

            {/* MOBILE VIEW */}
            <div className="sm:hidden flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={item.userData.image}
                  className="w-12 h-12 rounded-full object-cover"
                  alt=""
                />
                <div>
                  <p className="font-medium text-gray-800">{item.userData.name}</p>
                  <p className="text-xs text-gray-500">{calculateAge(item.userData.dob)} yrs</p>
                  <p className="text-xs text-gray-500">Gender: {item.userData.gender}</p>
                </div>
              </div>

              <div className="text-sm text-gray-700 flex flex-col">
                <p><span className="font-medium">Date:</span> {slotDateFormat(item.slotDate)}</p>
                <p><span className="font-medium">Time:</span> {item.slotTime}</p>
              </div>

              <div className="flex items-center gap-3 mt-1">
                <img
                  src={item.doctorData.image}
                  className="w-10 h-10 rounded-full object-cover"
                  alt=""
                />
                <p className="text-gray-700 font-medium">{item.doctorData.name}</p>
              </div>

              <p className="text-sm text-gray-700">
                <span className="font-medium">Fees:</span> ₹{item.doctorData.fees}
              </p>

              <div className="mt-2">
                {item.cancelled ? (
                  <p className="text-red-600 font-medium">Cancelled</p>
                ) : item.payment || item.isCompleted ? (
                  <p className="text-green-600 font-medium">Completed</p>
                ) : (
                  <div className="flex gap-4 mt-1">
                    <img
                      onClick={() => cancelAppointment(item._id)}
                      className="w-10 cursor-pointer"
                      src={assets.cancel_icon}
                      alt=""
                    />
                  </div>
                )}
              </div>
            </div>

            {/* DESKTOP VIEW */}
            <div className="hidden sm:grid sm:grid-cols-[0.5fr_3fr_1fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 gap-1">

              {/* Correct Row Number With Pagination */}
              <p>{(currentPage - 1) * itemsPerPage + index + 1}</p>

              <div className="flex items-center gap-2">
                <img
                  src={item.userData.image}
                  className="w-10 h-10 rounded-full object-cover"
                  alt=""
                />
                <p>{item.userData.name}</p>
              </div>

              <p>{item.userData.gender || "N/A"}</p>
              <p>{calculateAge(item.userData.dob)}</p>
              <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>

              <div className="flex items-center gap-2">
                <img
                  className="w-8 h-8 rounded-full object-cover"
                  src={item.doctorData.image}
                  alt=""
                />
                <p>{item.doctorData.name}</p>
              </div>

              <p>₹{item.doctorData.fees}</p>

              {item.cancelled ? (
                <p className="text-red-600 font-medium">Cancelled</p>
              ) : item.payment || item.isCompleted ? (
                <p className="text-green-600 font-medium">Completed</p>
              ) : (
                <div className="flex">
                  <img
                    onClick={() => cancelAppointment(item._id)}
                    className="w-10 cursor-pointer"
                    src={assets.cancel_icon}
                    alt=""
                  />
                </div>
              )}

            </div>

          </div>
        ))}
      </div>

      {/* PAGINATION BUTTONS */}
      <div className="flex justify-center gap-4 py-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className={`px-4 py-2 rounded border ${currentPage === 1 ? "opacity-40 cursor-not-allowed" : ""
            }`}
        >
          Prev
        </button>

        <span className="px-4 py-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className={`px-4 py-2 rounded border ${currentPage === totalPages ? "opacity-40 cursor-not-allowed" : ""
            }`}
        >
          Next
        </button>
      </div>

    </div>
  );
};

export default AllAppointment;
