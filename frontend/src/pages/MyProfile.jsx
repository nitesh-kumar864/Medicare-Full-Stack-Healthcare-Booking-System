import React, { useContext, useState, useRef } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import useUsernameAvailability from "../hooks/useUsernameAvailability";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileDetails from "../components/profile/ProfileDetails";
import ProfileActions from "../components/profile/ProfileActions";

const MyProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    userData,
    setUserData,
    token,
    backendUrl,
    loadUserProfileData,
  } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [isUsernameEdit, setIsUsernameEdit] = useState(false);
  const [image, setImage] = useState(false);
  const [updating, setUpdating] = useState(false);

  
  const {
    username: newUsername,
    setUsername: setNewUsername,
    usernameStatus,
    isUsernameValid,
    checkingUsername,
    checkUsernameAvailability,
  } = useUsernameAvailability({
    backendUrl,
    token,
    currentUsername: userData.username,
  });

  // ---------------- CHANGE USERNAME ----------------
  const changeUsername = async () => {
    if (!isUsernameValid) return;

    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/change-username",
        { newUsername },
        { headers: { token } }
      );

      if (data.success) {
        toast.success("Username updated successfully");

        setUserData((prev) => ({
          ...prev,
          username: data.username,
        }));

        setIsUsernameEdit(false);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to update username");
    }
  };

  // ---------------- FORMAT DATE ----------------
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // ---------------- VALIDATION ----------------
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    gender: "",
    dob: "",
  });

  const validateProfile = () => {
    let newErrors = {};

    if (!userData.name?.trim()) newErrors.name = "Name is required";
    if (!userData.phone || userData.phone.length !== 10)
      newErrors.phone = "Phone number must be 10 digits";
    if (!userData.gender) newErrors.gender = "Select a valid gender";
    if (!userData.dob) newErrors.dob = "Date of birth is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------- UPDATE PROFILE ----------------
  const updateUserProfileData = async () => {
    if (!validateProfile()) return;

    try {
      setUpdating(true);

      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);

      if (image) formData.append("image", image);

      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success("Profile updated successfully!");
        await loadUserProfileData(token);

        if (location.state?.returnTo) {
          navigate(location.state.returnTo);
        }

        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message || "Please fill all fields");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Something went wrong"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (!userData) return null;

  return (
    <div className="pt-28 pb-10 flex justify-center">
      <div className="w-full max-w-xl bg-white/40 backdrop-blur-xl shadow-xl rounded-3xl p-8 border border-gray-300">

        <ProfileHeader
          userData={userData}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          image={image}
          setImage={setImage}
          errors={errors}
          setErrors={setErrors}
          setUserData={setUserData}
        />

        <ProfileDetails
          userData={userData}
          isEdit={isEdit}
          isUsernameEdit={isUsernameEdit}
          setIsUsernameEdit={setIsUsernameEdit}
          newUsername={newUsername}
          setNewUsername={setNewUsername}
          usernameStatus={usernameStatus}
          isUsernameValid={isUsernameValid}
          checkingUsername={checkingUsername}
          checkUsernameAvailability={checkUsernameAvailability}
          changeUsername={changeUsername}
          errors={errors}
          setErrors={setErrors}
          setUserData={setUserData}
          formatDate={formatDate}
        />

        <ProfileActions
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          updateUserProfileData={updateUserProfileData}
          updating={updating}
        />

      </div>
    </div>
  );
};

export default MyProfile;
