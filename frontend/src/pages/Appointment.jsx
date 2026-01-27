import React, { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Loader from "../components/Loader";
import RelatedDoctor from "../components/RelatedDoctor";
import ConfirmModal from "../components/ConfirmModal";

import DoctorInfo from "../components/appointment/DoctorInfo";
import SlotBooking from "../components/appointment/SlotBooking";
import ReviewSection from "../components/appointment/ReviewSection";

import useAppointmentCore from "../hooks/useAppointmentCore";

const Appointment = () => {
  const { docId } = useParams();
  const navigate = useNavigate();

  const {
    doctors,
    currencySymbol,
    backendUrl,
    token,
    getDoctorsData,
    userData,
  } = useContext(AppContext);

  const appointment = useAppointmentCore({
    docId,
    doctors,
    backendUrl,
    token,
    getDoctorsData,
    userData,
    navigate,
  });

  if (!appointment.docInfo || appointment.docSlots.length === 0) {
    return (
      <div className="pt-24 flex justify-center items-center min-h-[50vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="pt-24">
      <DoctorInfo
        docInfo={appointment.docInfo}
        currencySymbol={currencySymbol}
      />

      <SlotBooking {...appointment} />

      <ReviewSection {...appointment} userData={userData} />

      <ConfirmModal
        open={appointment.showConfirm}
        onConfirm={appointment.handleConfirmPayment}
        onCancel={appointment.handleCancelPayment}
      />

      <RelatedDoctor
        docId={docId}
        speciality={appointment.docInfo.speciality}
      />
    </div>
  );
};

export default Appointment;
