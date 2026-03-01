import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import useRazorpay from "../payments/useRazorpay";
import socket from "../socket";

export const useMyAppointments = ({
  backendUrl,
  token,
  userData,
  getDoctorsData,
}) => {
  const [appointments, setAppointments] = useState([]);
  const [downloadingId, setDownloadingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [unreadMap, setUnreadMap] = useState({});

  const months = [
    "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const slotDateFormat = (slotDate) => {
    const d = slotDate.split("_");
    return `${d[0]} ${months[Number(d[1])]}, ${d[2]}`;
  };

  /* ================= FETCH ================= */
  async function getUserAppointments() {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${backendUrl}/api/user/appointments`,
        { headers: { token } }
      );

      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  }

  // socket
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
                Authorization: `Bearer ${token}`,
              },
            }

          );

          temp[appt._id] = res.data.count || 0;

        } catch (err) {
          console.log("Unread fetch error", err);
        }
      }

      setUnreadMap(temp);
    };

    loadUnreadCounts();

  }, [appointments]);


  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      if (msg.senderRole === "doctor") {
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
  }, [token]);


  /* ================= PAYMENT ================= */
  const { startPayment } = useRazorpay(backendUrl, token, async () => {
    await getUserAppointments();
    await getDoctorsData();
  });

  const handlePayNow = async (appointmentId) => {
    const canPay = await startPayment(appointmentId);
    if (canPay) toast.success("Redirecting to payment...");
  };

  /* ================= CANCEL ================= */
  const cancelAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?"))
      return;

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId, userId: userData?._id },
        { headers: { token } }
      );

      if (data.success) {
        toast.success("Appointment cancelled successfully!");
        await getUserAppointments();
        await getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPrescription = async (appointmentId) => {
    try {
      setDownloadingId(appointmentId);

      const response = await axios.get(
        `${backendUrl}/api/pdf/download/${appointmentId}`,
        {
          headers: { token },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `prescription-${appointmentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (error) {
      console.log(error.response?.data);
    } finally {
      setDownloadingId(null);
    }
  };

  /* ================= FILTER ================= */
  const filteredAppointments = appointments.filter((a) => {
    if (filter === "cancelled") return a.status === "cancelled";
    if (filter === "completed")
      return a.status === "completed" || a.status === "booked";
    return true;
  });

  /* ================= STATS ================= */
  const stats = {
    total: appointments.filter(a =>
      ["booked", "completed", "cancelled"].includes(a.status)
    ).length,

    completed: appointments.filter(
      a => a.status === "completed" || a.status === "booked"
    ).length,

    cancelled: appointments.filter(
      a => a.status === "cancelled"
    ).length,
  };

  const getAppointmentStatus = (a) => {
    if (a.status === "cancelled")
      return { type: "cancelled", label: "Cancelled" };

    if (a.isCompleted || a.payment)
      return { type: "completed", label: "Completed" };

    if (a.status === "booked")
      return { type: "confirmed", label: "Confirmed" };

    return { type: "unpaid", label: "Unpaid" };
  };

  useEffect(() => {
    if (token) getUserAppointments();
  }, [token]);

  return {
    loading,
    filter,
    setFilter,
    stats,
    filteredAppointments,
    slotDateFormat,
    handlePayNow,
    cancelAppointment,
    handleDownloadPrescription,
    downloadingId,
    getAppointmentStatus,
    unreadMap,
  };
};
