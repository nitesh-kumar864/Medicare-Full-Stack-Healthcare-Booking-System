import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { AdminContext } from "../../context/AdminContext";
import Loader from "../../components/Loader";
import DoctorForm from "../../components/admin/DoctorForm";

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("General physician");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { backendUrl, aToken } = useContext(AdminContext);

  // ================= SUBMIT HANDLER =================
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (!docImg) {
        setLoading(false);
        return toast.error("Please upload image");
      }

      const formData = new FormData();
      formData.append("image", docImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", Number(fees));
      formData.append("about", about);
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append(
        "address",
        JSON.stringify({ line1: address1, line2: address2 })
      );

      const { data } = await axios.post(
        `${backendUrl}/api/admin/add-doctor`,
        formData,
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setDocImg(false);
        setName("");
        setEmail("");
        setPassword("");
        setExperience("1 Year");
        setFees("");
        setAbout("");
        setSpeciality("General physician");
        setDegree("");
        setAddress1("");
        setAddress2("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= LOADER =================
  if (loading) {
    return (
      <Loader
        title="Adding Doctor"
        subtitle="Saving doctor information..."
      />
    );
  }

  // ================= JSX =================
  return (
    <DoctorForm
      docImg={docImg}
      setDocImg={setDocImg}
      name={name}
      setName={setName}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      experience={experience}
      setExperience={setExperience}
      fees={fees}
      setFees={setFees}
      speciality={speciality}
      setSpeciality={setSpeciality}
      degree={degree}
      setDegree={setDegree}
      address1={address1}
      setAddress1={setAddress1}
      address2={address2}
      setAddress2={setAddress2}
      about={about}
      setAbout={setAbout}
      onSubmitHandler={onSubmitHandler}
    />
  );
};

export default AddDoctor;
