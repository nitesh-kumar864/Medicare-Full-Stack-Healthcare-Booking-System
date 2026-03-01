import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

import AppointmentsDashboard from "../components/myAppointments/AppointmentsDashboard";
import { useMyAppointments } from "../hooks/useMyAppointments";

const MyAppointments = () => {
  const navigate = useNavigate();
  const { backendUrl, token, userData, getDoctorsData } =
    useContext(AppContext);

  const {
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
  } = useMyAppointments({
    backendUrl,
    token,
    userData,
    getDoctorsData,
  });

  if (loading) {
    return (
      <div className="pt-24 flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pt-24 px-4 md:px-8 bg-gradient-to-b from-gray-50 to-blue-50 min-h-screen pb-10">
      <AppointmentsDashboard
        stats={stats}
        filter={filter}
        setFilter={setFilter}
        filteredAppointments={filteredAppointments}
        navigate={navigate}
        slotDateFormat={slotDateFormat}
        cancelAppointment={cancelAppointment}
       handleDownloadPrescription={handleDownloadPrescription}
        downloadingId={downloadingId}
        handlePayNow={handlePayNow}
        getAppointmentStatus={getAppointmentStatus}
        unreadMap={unreadMap}
      />
    </div>
  );
};

export default MyAppointments;
