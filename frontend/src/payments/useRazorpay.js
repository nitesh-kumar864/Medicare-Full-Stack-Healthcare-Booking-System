import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const useRazorpay = (backendUrl, token, callback) => {
  const navigate = useNavigate();

  /* --------------- INIT PAYMENT POPUP------------------------ */
  const initPayment = (order, type, appointmentId) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Medicare Payment",
      description: type === "appointment" ? "Doctor Appointment Fee" : "Bed Booking Fee",
      order_id: order.id,

      handler: async (response) => {
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/payment/verify-payment`,
            response,
            { headers: { token } }
          );

          if (data.success) {
            toast.success("Payment Successful!");

            // Refresh UI (appointments or bed list)
            callback && callback();

            if (type === "appointment") navigate("/my-appointments");
            if (type === "bed") navigate("/my-bed-bookings");
          } else {
            toast.error(data.message || "Payment failed");
          }
        } catch (err) {
          toast.error(err.message);
        }
      },

      theme: { color: "#275EF5" },
    };

    const razor = new window.Razorpay(options);

    /* -----------------HANDLE PAYMENT FAILURE------------------- */
    razor.on("payment.failed", async function () {
      try {
        if (type === "appointment") {
          await axios.post(
            `${backendUrl}/api/payment/release-appointment-slot`,
            { appointmentId },
            { headers: { token } }
          );
        }

        if (type === "bed") {
          await axios.post(
            `${backendUrl}/api/bed/unlock`,
            { bookingId: appointmentId },
            { headers: { token } }
          );
        }

        toast.error("Payment failed. Booking released.");
      } catch {
        toast.error("Payment failed");
      }
    });

    razor.open();
  };

  /* -----------------START APPOINTMENT PAYMENT------------------- */
  const startPayment = async (appointmentId, setLoading) => {
    try {
      if (setLoading) setLoading(true);

      const { data } = await axios.post(
        `${backendUrl}/api/payment/create-order`,
        { type: "appointment", id: appointmentId },
        { headers: { token } }
      );

      if (!data.success) {
        toast.error(data.message || "Invalid appointment");
        return false; 
      }

      initPayment(data.order, "appointment", appointmentId);
      return true; 
    } catch (err) {
      toast.error(err.message);
      return false;
    } finally {
      if (setLoading) setLoading(false);
    }
  };

  /* --------------START BED PAYMENT------------------ */
  const startBedPayment = async (bookingId, setLoading) => {
    try {
      if (setLoading) setLoading(true);

      const { data } = await axios.post(
        `${backendUrl}/api/payment/create-order`,
        { type: "bed", id: bookingId },
        { headers: { token } }
      );

      if (data.success) {
        initPayment(data.order, "bed", bookingId);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }

    if (setLoading) setLoading(false);
  };

  return { startPayment, startBedPayment };
};

export default useRazorpay;
