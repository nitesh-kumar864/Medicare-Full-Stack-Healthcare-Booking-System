import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { API } from "../config";
import useRazorpay from "../payments/useRazorpay";

import BedFormModal from "../components/BedFormModal";
import ConfirmModal from "../components/ConfirmModal";

import BedDashboard from "../components/bed/BedDashboard";
import BedGrid from "../components/bed/BedGrid";

const BED_RANGES = {
  general: {
    start: 101,
    label: "General Ward",
    icon: null,
    availableBg: "bg-blue-50 border-blue-200",
    occupiedBg: "bg-blue-100 border-blue-300",
    badge: "bg-blue-500",
  },
  icu: {
    start: 201,
    label: "ICU",
    icon: null,
    availableBg: "bg-red-50 border-red-200",
    occupiedBg: "bg-red-100 border-red-300",
    badge: "bg-red-500",
  },
  emergency: {
    start: 301,
    label: "Emergency",
    icon: null,
    availableBg: "bg-amber-50 border-amber-200",
    occupiedBg: "bg-amber-100 border-amber-300",
    badge: "bg-amber-500",
  },
};

const BedPage = () => {
  const navigate = useNavigate();
  const { token, userData } = useContext(AppContext);

  const [pageLoading, setPageLoading] = useState(true);
  const [data, setData] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingBedBookingId, setPendingBedBookingId] = useState(null);

  const [selectedBed, setSelectedBed] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedType, setSelectedType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [stats, setStats] = useState({
    total: 0,
    occupied: 0,
    available: 0,
    utilization: 0,
  });

  // LOAD BED DATA
  const loadBedData = async (isSilent = false) => {
    try {
      if (!isSilent) setPageLoading(true);

      const res = await axios.get(`${API}/api/bed/availability`);
      setData(res.data);

      if (res.data) {
        const utilization =
          (res.data.occupiedBeds / res.data.totalBeds) * 100;

        setStats({
          total: res.data.totalBeds,
          occupied: res.data.occupiedBeds,
          available: res.data.availableBeds,
          utilization: Math.round(utilization),
        });
      }
    } catch {
      toast.error("Failed to load beds");
    } finally {
      if (!isSilent) setPageLoading(false);
    }
  };

  useEffect(() => {
    loadBedData(false);

    const interval = setInterval(() => {
      loadBedData(true);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const { startBedPayment } = useRazorpay(API, token, loadBedData);

  // OPEN FORM MODAL
  const handleSelectBed = (bedNum) => {
    if (!token) {
      toast.warn("Please login to book a bed");
      return navigate("/login", { state: { from: "/bed-availability" } });
    }

    if (!userData) {
      toast.error("Please login again");
      return navigate("/login", { state: { from: "/bed-availability" } });
    }

    if (
      userData.gender === "Not selected" ||
      userData.dob === "Not selected" ||
      !userData.phone ||
      userData.phone.length < 10 
    ) {
      toast.error("Complete your profile before booking.");
      return navigate("/my-profile", {
        state: { returnTo: "/bed-availability" },
      });
    }

    setSelectedBed(bedNum);
    setIsModalOpen(true);
  };

  const handleBookSubmit = async (formData) => {
    if (!token) return navigate("/login");

    try {
      const res = await axios.post(
        `${API}/api/bed/book`,
        { ...formData, bedNumber: selectedBed },
        { headers: { token } }
      );

      if (!res.data.success) {
        toast.warning(res.data.message);
        return;
      }

      setIsModalOpen(false);

      const bookingId = res.data.booking?._id;

      if (!bookingId) {
        toast.error("Booking failed. Please try again.");
        return;
      }

      setPendingBedBookingId(bookingId);
      setShowConfirm(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    }
  };

  const handleConfirmBedPayment = () => {
    setShowConfirm(false);
    toast.success("Redirecting to payment...");
    startBedPayment(pendingBedBookingId, () => { });
  };

  const handleCancelBedPayment = () => {
    setShowConfirm(false);
    toast.info("Payment cancelled");
  };

  if (pageLoading) {
    return (
      <div className="pt-24 flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading bed availability...</p>
        </div>
      </div>
    );
  }

  // GENERATE BED LIST (same code)
  const occupiedList = data.occupiedNumbers || [];
  const lockedList = data.lockedNumbers || [];
  const bedTypes = data.bedTypes;

  let bedNumbers = [];

  if (selectedType === "all") {
    Object.keys(BED_RANGES).forEach((type) => {
      const start = BED_RANGES[type].start;
      const total = bedTypes[type].total;
      for (let i = 0; i < total; i++) bedNumbers.push(start + i);
    });
  } else {
    const start = BED_RANGES[selectedType].start;
    const total = bedTypes[selectedType].total;
    for (let i = 0; i < total; i++) bedNumbers.push(start + i);
  }

  if (searchQuery) {
    bedNumbers = bedNumbers.filter((num) =>
      num.toString().includes(searchQuery)
    );
  }

  bedNumbers.sort((a, b) => a - b);

  const getBedType = (bedNum) => {
    if (
      bedNum >= BED_RANGES.general.start &&
      bedNum < BED_RANGES.general.start + bedTypes.general.total
    )
      return "general";

    if (
      bedNum >= BED_RANGES.icu.start &&
      bedNum < BED_RANGES.icu.start + bedTypes.icu.total
    )
      return "icu";

    if (
      bedNum >= BED_RANGES.emergency.start &&
      bedNum <
      BED_RANGES.emergency.start + bedTypes.emergency.total
    )
      return "emergency";

    return null;
  };

  return (
    <div className="pt-24 px-4 md:px-8 bg-gradient-to-b from-gray-50 to-blue-50 min-h-screen pb-10">
      <BedDashboard
        stats={stats}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <BedGrid
        bedNumbers={bedNumbers}
        occupiedList={occupiedList}
        lockedList={lockedList}
        getBedType={getBedType}
        BED_RANGES={BED_RANGES}
        handleSelectBed={handleSelectBed}
      />

      <BedFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleBookSubmit}
        bedData={{
          bedType: getBedType(selectedBed),
          occupiedNumbers: data.occupiedNumbers,
        }}
        selectedBed={selectedBed}
        userData={userData}
      />

      <ConfirmModal
        open={showConfirm}
        onConfirm={handleConfirmBedPayment}
        onCancel={handleCancelBedPayment}
      />
    </div>
  );
};

export default BedPage;
