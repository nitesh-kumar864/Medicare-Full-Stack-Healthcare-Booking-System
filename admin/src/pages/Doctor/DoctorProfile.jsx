import React, { useState, useContext, useEffect, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { DoctorContext } from "../../context/DoctorContext";
import Loader from "../../components/Loader";
import ProfileDetails from "../../components/doctor/ProfileDetails";
import DoctorAvailability from "../../components/doctor/DoctorAvailability";



const generateManagementSlots = () => {
  const days = [];
  const now = new Date();

  // Current time + 30 minutes
  const minimumTime = new Date(now.getTime() + 30 * 60 * 1000);

  for (let offset = 0; offset < 7; offset++) {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    date.setHours(0, 0, 0, 0);

    const timeSlots = [];

    for (let minutes = 10 * 60; minutes < 22 * 60; minutes += 30) {
      const hour24 = Math.floor(minutes / 60);
      const minute = minutes % 60;

      const slotDateTime = new Date(date);
      slotDateTime.setHours(hour24, minute, 0, 0);

      // Hide slots within the next 30 minutes or in the past
      if (slotDateTime <= minimumTime) {
        continue;
      }

      const hour12 = hour24 % 12 || 12;
      const ampm = hour24 >= 12 ? "PM" : "AM";

      timeSlots.push(
        `${String(hour12).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${ampm}`
      );
    }

    days.push({
      fullDate: date,
      date: date.getDate(),
      day: date.toLocaleDateString("en-IN", {
        weekday: "short",
        timeZone: "Asia/Kolkata",
      }),
      timeSlots,
    });
  }

  return days;
};

const DoctorProfile = () => {
  const {
    dToken,
    profileData,
    setProfileData,
    getProfileData,
    backendUrl,
    isPageLoading,
    isActionLoading,
  } = useContext(DoctorContext);

  const [isEdit, setIsEdit] = useState(false);

  const docSlots = useMemo(() => generateManagementSlots(), []);
  useEffect(() => {
    if (dToken) getProfileData();
  }, [dToken]);

  // ---------------- UPDATE PROFILE ----------------
  const updateProfile = async () => {
    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available,
      };

      const { data } = await axios.post(
        `${backendUrl}/api/doctor/update-profile`,
        updateData,
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  // ---------------- LOAD PROFILE ----------------
  // useEffect(() => {
  //   if (dToken) {
  //     getProfileData();
  //   }
  // }, [dToken]);

  // ---------------- PAGE LOADING ----------------
  if (isPageLoading || !profileData) {
    return (
      <Loader
        title="Loading Profile"
        subtitle="Fetching your profile details..."
      />
    );
  }

  // ---------------- JSX ----------------
  return (
    <div className="space-y-6">
      <ProfileDetails
        profileData={profileData}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        setProfileData={setProfileData}
        updateProfile={updateProfile}
        isActionLoading={isActionLoading}
      />

      <DoctorAvailability
        doctorId={profileData._id}
        backendUrl={backendUrl}
        dToken={dToken}
        docSlots={docSlots}
        unavailableSlots={profileData.unavailableSlots || []}
        unavailableDates={profileData.unavailableDates || []}
        onRefresh={getProfileData}
      />
    </div>
  );
};

export default DoctorProfile;
