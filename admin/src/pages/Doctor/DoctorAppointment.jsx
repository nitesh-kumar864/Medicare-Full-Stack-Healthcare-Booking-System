import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import Loader from "../../components/Loader";
import { MessageCircle } from "lucide-react";
import { joinDoctorRoom } from "../../chat/joinRoom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../../socket";

const DoctorAppointment = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
    isPageLoading,
  } = useContext(DoctorContext);

  const navigate = useNavigate();

  const { calculateAge, slotDateFormat } = useContext(AppContext);

  const [filterType, setFilterType] = useState("all");
  const [unreadMap, setUnreadMap] = useState({});


  // ---------- FILTER LOGIC ----------
  const filterAppointments = () => {
    if (!appointments) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filtered = appointments.filter((item) => {
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

    return filtered.sort((a, b) => {
      const dateA = new Date(
        `${a.slotDate.split("_").reverse().join("-")} ${a.slotTime}`
      );
      const dateB = new Date(
        `${b.slotDate.split("_").reverse().join("-")} ${b.slotTime}`
      );

      return dateB - dateA;
    });
  };

  useEffect(() => {
    if (!appointments) return;

    const loadUnreadCounts = async () => {

      const temp = {};

      for (let appt of appointments) {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/chat/unread/${appt._id}`,
            {
              headers: {
                Authorization: `Bearer ${dToken}`,
              },
            }
          );

          console.log("Unread API Response for", appt._id, ":", res.data);

          temp[appt._id] = res.data.count || 0;

        } catch (err) {
          console.log("Unread fetch error", err);
        }
      }

      console.log("Final unreadMap:", temp);

      setUnreadMap(temp);
    };

    loadUnreadCounts();

  }, [appointments]);


  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      if (msg.senderRole === "user") {
        setUnreadMap((prev) => ({
          ...prev,
          [msg.appointmentId]:
            (prev[msg.appointmentId] || 0) + 1,
        }));
      }
    };

    const handleMessagesSeen = ({ appointmentId }) => {
      setUnreadMap((prev) => ({
        ...prev,
        [appointmentId]: 0,
      }));
    };

    socket.on("new-message", handleNewMessage);
    socket.on("messages-seen", handleMessagesSeen);

    return () => {
      socket.off("new-message", handleNewMessage);
      socket.off("messages-seen", handleMessagesSeen);
    };
  }, [dToken]);

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
          <p>Action</p>
          <p>Messages</p>
        </div>

        {/* TABLE ROWS */}
        {filteredList.length === 0 && (
          <p className="text-center py-10 text-gray-500">No appointments found.</p>
        )}

        {filteredList.map((item, index) => {

          const unreadCount = unreadMap[item._id] || 0;

          return (

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

                {!item.cancelled &&
                  (item.payment === true || item.isCompleted === true) && (
                    <div className="relative w-fit">
                      <button
                        onClick={() => {
                          joinDoctorRoom(item._id);
                          navigate(`/chat/${item._id}`);
                        }}
                       className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 relative"
                      >
                        <MessageCircle size={16} />
                        Chat

                        {unreadCount > 0 && (
                          <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px] font-bold text-white bg-red-500 rounded-full">
                            {unreadCount}
                          </span>
                        )}
                      </button>
                    </div>
                  )}
              </div>


              {/* DESKTOP TABLE ROW */}
              <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500">

                <p>{filteredList.length - index}</p>

                <div className="flex items-center gap-2">
                  <img
                    src={item.userData.image}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <p>{item.userData.name}</p>
                </div>

                {item.paymentMethod !== "none" ? (
                  <p className={`text-[11px] px-2 py-0.5 rounded-full font-medium w-fit ${item.paymentMethod === "online"
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
                    }`}>
                    {item.paymentMethod === "online" ? "Online" : "Cash"}
                  </p>
                ) : (
                  <p className="text-gray-400 text-xs italic">--</p>
                )}

                <p>{item.userData.gender}</p>

                <p>{calculateAge(item.userData.dob)}</p>

                <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>

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

                {!item.cancelled &&
                  (item.payment === true || item.isCompleted === true) && (
                    <div className="relative w-fit">
                      <button
                        onClick={() => {
                          joinDoctorRoom(item._id);
                          navigate(`/doctor/chat/${item._id}`);
                        }}
                        className="flex items-center gap-1 px-3 py-1 text-sm rounded bg-blue-50 text-blue-700 hover:bg-blue-100 relative"
                      >
                        <MessageCircle size={16} />
                        Chat

                        {unreadCount > 0 && (
                          <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px] font-bold text-white bg-red-500 rounded-full">
                            {unreadCount}
                          </span>
                        )}
                      </button>
                    </div>
                  )}

              </div>

            </div>

          );
        })}

      </div>
    </div>
  );
};

export default DoctorAppointment;
