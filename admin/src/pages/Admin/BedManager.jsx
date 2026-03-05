import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

import BedHeaderAndStats from "../../components/bed-manager/BedHeaderAndStats";
import WardConfiguration from "../../components/bed-manager/WardConfiguration";
import BedActions from "../../components/bed-manager/BedActions";

const BedManager = () => {
  const { backendUrl, aToken } = useContext(AdminContext);

  const [loading, setLoading] = useState(true);
  const [selectedBed, setSelectedBed] = useState("");
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  const [config, setConfig] = useState({
    totalBeds: 0,
    generalTotal: 0,
    icuTotal: 0,
    emergencyTotal: 0,
    occupiedBeds: 0,
    availableBeds: 0,
    utilization: 0,
  });

  const [stats, setStats] = useState({
    generalOccupied: 0,
    icuOccupied: 0,
    emergencyOccupied: 0,
  });

  // ================= FETCH CONFIG =================
  const fetchConfig = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/bed/availability`, {
        headers: { atoken: aToken },
      });

      const data = res.data;
      const occupied = data.occupiedBeds;
      const total = data.totalBeds;
      const utilization =
        total > 0 ? Math.round((occupied / total) * 100) : 0;

      setConfig({
        totalBeds: data.totalBeds,
        occupiedBeds: occupied,
        availableBeds: data.availableBeds,
        generalTotal: data.bedTypes?.general?.total || 0,
        icuTotal: data.bedTypes?.icu?.total || 0,
        emergencyTotal: data.bedTypes?.emergency?.total || 0,
        utilization,
      });

      const occupiedNumbers = data.occupiedNumbers || [];

      setStats({
        generalOccupied: occupiedNumbers.filter(
          (num) => num >= 101 && num <= 200
        ).length,
        icuOccupied: occupiedNumbers.filter(
          (num) => num >= 201 && num <= 220
        ).length,
        emergencyOccupied: occupiedNumbers.filter(
          (num) => num >= 301 && num <= 320
        ).length,
      });

      setLoading(false);
    } catch (err) {
      toast.error("Failed to load bed configuration");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, [aToken]);

  // ================= HANDLERS =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseInt(value) || 0;

    const newConfig = { ...config, [name]: numValue };

    if (
      name === "generalTotal" ||
      name === "icuTotal" ||
      name === "emergencyTotal"
    ) {
      newConfig.totalBeds =
        newConfig.generalTotal +
        newConfig.icuTotal +
        newConfig.emergencyTotal;
    }

    setConfig(newConfig);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.patch(
        `${backendUrl}/api/bed/admin/update-config`,
        {
          totalBeds: Number(config.totalBeds),
          generalTotal: Number(config.generalTotal),
          icuTotal: Number(config.icuTotal),
          emergencyTotal: Number(config.emergencyTotal),
        },
        { headers: { atoken: aToken } }
      );

      toast.success(res.data.message || "Configuration updated successfully!");
      fetchConfig();
    } catch (err) {
      toast.error("Failed to update configuration");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (
      !window.confirm(
        "Reset ALL beds? This will cancel all bookings and cannot be undone."
      )
    )
      return;

    setResetting(true);
    try {
      const res = await axios.post(
        `${backendUrl}/api/bed/admin/reset`,
        {},
        { headers: { atoken: aToken } }
      );

      toast.success(res.data.message || "All beds reset successfully");
      fetchConfig();
    } catch (err) {
      toast.error("Failed to reset beds");
    } finally {
      setResetting(false);
    }
  };

  const resetIndividualBed = async () => {
    if (!selectedBed) {
      toast.error("Enter a bed number");
      return;
    }

    if (
      !window.confirm(
        `Reset bed ${selectedBed}? This will free the bed and cancel its booking.`
      )
    )
      return;

    try {
      const res = await axios.put(
        `${backendUrl}/api/bed/admin/reset-individual/${selectedBed}`,
        {},
        { headers: { atoken: aToken } }
      );

      toast.success(
        res.data.message || `Bed ${selectedBed} reset successfully`
      );
      setSelectedBed("");
      fetchConfig();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Something went wrong"
      );
    }
  };


  const calculateUtilizationColor = (utilization) => {
    if (utilization >= 90) return "text-red-600";
    if (utilization >= 70) return "text-amber-600";
    return "text-emerald-600";
  };

  const calculateProgressWidth = (occupied, total) => {
    return total > 0 ? Math.min((occupied / total) * 100, 100) : 0;
  };

  if (loading) {
    return (
      <Loader
        title="Loading Bed Management"
        subtitle="Fetching hospital bed configuration..."
      />
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/20 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">

        <BedHeaderAndStats
          config={config}
          fetchConfig={fetchConfig}
          calculateUtilizationColor={calculateUtilizationColor}
        />

        <WardConfiguration
          config={config}
          stats={stats}
          handleChange={handleChange}
          calculateProgressWidth={calculateProgressWidth}
        />

        <BedActions
          handleSave={handleSave}
          handleReset={handleReset}
          resetIndividualBed={resetIndividualBed}
          saving={saving}
          resetting={resetting}
          selectedBed={selectedBed}
          setSelectedBed={setSelectedBed}
        />
      </div>
    </div>
  );
};

export default BedManager;
