import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { DoctorContext } from "../../context/DoctorContext";
import Loader from "../../components/Loader";
import ProfileDetails from "../../components/doctor/ProfileDetails";

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
  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

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
    <ProfileDetails
      profileData={profileData}
      isEdit={isEdit}
      setIsEdit={setIsEdit}
      setProfileData={setProfileData}
      updateProfile={updateProfile}
      isActionLoading={isActionLoading}
    />
  );
};

export default DoctorProfile;
