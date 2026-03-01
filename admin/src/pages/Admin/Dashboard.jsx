import React, { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import Loader from "../../components/Loader";

import DashboardHeader from "../../components/admin/dashboard/DashboardHeader";
import DashboardStats from "../../components/admin/dashboard/DashboardStats";
import DashboardAppointments from "../../components/admin/dashboard/DashboardAppointments";

const Dashboard = () => {
  const {
    aToken,
    getDashData,
    dashData,
    cancelAppointment,
    handleDownloadPrescription,
    isActionLoading,
    isAdminPageLoading,
    backendUrl,
  } = useContext(AdminContext);

  const { slotDateFormat } = useContext(AppContext);

  const [bedStats, setBedStats] = useState(null);
  const [loadingBeds, setLoadingBeds] = useState(true);
  const [bedRevenue, setBedRevenue] = useState(0);

  // ================= BED STATS =================
  const fetchBedStats = useCallback(async () => {
    try {
      setLoadingBeds(true);
      const response = await axios.get(
        `${backendUrl}/api/bed/availability`,
        {
          headers: { atoken: aToken },
        }
      );
      setBedStats(response.data);
    } catch (err) {
      console.error("Bed stats error:", err);
    } finally {
      setLoadingBeds(false);
    }
  }, [backendUrl, aToken]);

  const fetchBedRevenue = useCallback(async () => {
    try {
      const res = await axios.get(
        `${backendUrl}/api/admin/bed-revenue`,
        {
          headers: { atoken: aToken },
        }
      );
      if (res.data.success) {
        setBedRevenue(res.data.bedRevenue || 0);
      }
    } catch (err) {
      console.error("Bed revenue error:", err);
    }
  }, [backendUrl, aToken]);

  // ================= INITIAL LOAD =================
  useEffect(() => {
    if (aToken) {
      getDashData();
      fetchBedStats();
      fetchBedRevenue();
    }
  }, [aToken]);

  const refreshAllData = () => {
    getDashData();
    fetchBedStats();
    fetchBedRevenue();
  };

  // ================= REVENUE CALC =================
  const appointmentRevenue = dashData?.revenue || 0;
  const totalRevenue = appointmentRevenue + bedRevenue;

  // ================= LOADING =================
  if (isAdminPageLoading || loadingBeds || !dashData) {
    return (
      <Loader
        title="Loading Dashboard"
        subtitle="Fetching hospital analytics..."
      />
    );
  }

  // ================= JSX =================
  return (
    <div className="p-6 md:p-8 bg-gradient-to-b from-gray-50 to-blue-50 min-h-screen">
      <DashboardHeader
        refreshAllData={refreshAllData}
        isActionLoading={isActionLoading}
      />

      <DashboardStats
        dashData={dashData}
        bedStats={bedStats}
        bedRevenue={bedRevenue}
        appointmentRevenue={appointmentRevenue}
        totalRevenue={totalRevenue}
        fetchBedStats={fetchBedStats}
      />

      <DashboardAppointments
        appointments={dashData.latestAppointments}
        slotDateFormat={slotDateFormat}
        cancelAppointment={cancelAppointment}
        handleDownloadPrescription={handleDownloadPrescription}

        isActionLoading={isActionLoading}
      />
    </div>
  );
};

export default Dashboard;
