import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import Loader from "../../components/Loader";

const DoctorAppointment = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
    isPageLoading,
  } = useContext(DoctorContext);

  const { calculateAge, slotDateFormat } = useContext(AppContext);

  const [filterType, setFilterType] = useState("all");

  // ---------- FILTER LOGIC ----------
  const filterAppointments = () => {
    if (!appointments) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return appointments.filter((item) => {

      // Convert " 24_11_2025" → JS date
      const [day, month, year] = item.slotDate.trim().split("_");
      const apptDate = new Date(`${year}-${month}-${day}`);
      apptDate.setHours(0, 0, 0, 0);

      // TODAY
      if (filterType === "today") {
        return apptDate.getTime() === today.getTime();
      }

      // UPCOMING (future appointments + not cancelled + not completed)
      if (filterType === "upcoming") {
        return (
          apptDate.getTime() > today.getTime() &&
          !item.cancelled &&
          !item.isCompleted
        );
      }

      // COMPLETED (either payment done OR isCompleted true)
      if (filterType === "completed") {
        return item.isCompleted === true || item.payment === true;
      }

      return true; // ALL
    });
  };

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  if (isPageLoading || !appointments) {
    return (
      <Loader
        title="Loading Appointments"
        subtitle="Fetching appointment records..."
      />
    );
  }

  const filteredList = filterAppointments();

  return (
    <div className="w-full max-w-6xl m-5 ">
      <p className="mb-3 text-lg font-medium">All Appointments</p>

      {/* FILTER BUTTONS */}
      <div className="flex gap-3 mb-3">
        {["all", "today", "upcoming", "completed"].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1 rounded capitalize ${filterType === type
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
              }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll ">

        {/* TABLE HEADER */}
        <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b ">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Gender</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {/* TABLE ROWS */}
        {filteredList.length === 0 && (
          <p className="text-center py-10 text-gray-500">No appointments found.</p>
        )}

        {filteredList.map((item, index) => (
          <div key={index} className="border-b py-4 px-4 hover:bg-gray-50">

            {/* MOBILE CARD VIEW */}
            <div className="sm:hidden flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={item.userData.image}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{item.userData.name}</p>
                  <p className="text-xs text-gray-500">
                    {calculateAge(item.userData.dob)} years old
                  </p>
                  <p className="text-xs text-gray-500">
                    Gender: {item.userData.gender}
                  </p>
                </div>
              </div>

              <div className="text-sm text-gray-600">

                {(item.payment === true || item.isCompleted === true) ? (
                  <p className={`text-[11px] px-2 py-0.5 rounded-full font-medium w-fit ${item.payment ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                    }`}>
                    {item.payment ? "Online" : "Cash"}
                  </p>
                ) : (
                  <p className="text-gray-400 text-xs italic">--</p>
                )}

                <p><b>Date:</b> {slotDateFormat(item.slotDate)}</p>
                <p><b>Time:</b> {item.slotTime}</p>
                <p><b>Fees:</b> ₹{item.doctorData.fees}</p>
              </div>

              <div>
                {item.cancelled ? (
                  <p className="text-red-600 font-medium">Cancelled</p>
                ) : item.payment || item.isCompleted ? (
                  <p className="text-green-600 font-medium">Completed</p>
                ) : (
                  <div className="flex gap-5 mt-1">
                    <img
                      src={assets.cancel_icon}
                      className="w-10 cursor-pointer"
                      onClick={() => cancelAppointment(item._id)}
                    />
                    <img
                      src={assets.tick_icon}
                      className="w-10 cursor-pointer"
                      onClick={() => completeAppointment(item._id)}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* DESKTOP TABLE ROW */}
            <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500">

              <p>{index + 1}</p>

              <div className="flex items-center gap-2">
                <img
                  src={item.userData.image}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <p>{item.userData.name}</p>
              </div>

              {item.paymentMethod !== "none" ? (
                <p
                  className={`text-[11px] px-2 py-0.5 rounded-full font-medium w-fit ${item.paymentMethod === "online"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                    }`}
                >
                  {item.paymentMethod === "online" ? "Online" : "Cash"}
                </p>
              ) : (
                <p className="text-gray-400 text-xs italic">--</p>
              )}

              <p>{item.userData.gender}</p>

              <p>{calculateAge(item.userData.dob)}</p>

              <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>

              <p>₹{item.doctorData.fees}</p>

              {item.cancelled ? (
                <p className="text-red-600 font-medium">Cancelled</p>
              ) : item.payment || item.isCompleted ? (
                <p className="text-green-600 font-medium">Completed</p>
              ) : (
                <div className="flex">
                  <img
                    src={assets.cancel_icon}
                    className="w-10 cursor-pointer"
                    onClick={() => cancelAppointment(item._id)}
                  />
                  <img
                    src={assets.tick_icon}
                    className="w-10 cursor-pointer"
                    onClick={() => completeAppointment(item._id)}
                  />
                </div>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorAppointment;
