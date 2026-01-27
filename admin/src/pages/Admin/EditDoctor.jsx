import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

import EditDoctorForm from "../../components/admin/EditDoctorForm";

const EditDoctor = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { backendUrl, aToken } = useContext(AdminContext);

  const [form, setForm] = useState({
    name: "",
    speciality: "",
    degree: "",
    experience: "",
    fees: "",
    about: "",
    available: false,
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);

  /* ---------- Load Doctor ---------- */
  useEffect(() => {
    const loadDoctor = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/api/admin/doctor/${doctorId}`,
          {
            headers: { atoken: aToken },
            withCredentials: true,
          }
        );

        if (res.data.success) {
          const d = res.data.doctor;
          setForm({
            name: d.name || "",
            speciality: d.speciality || "",
            degree: d.degree || "",
            experience: d.experience || "",
            fees: d.fees || "",
            about: d.about || "",
            available: Boolean(d.available),
          });
          setPreview(d.image || "");
        } else {
          toast.error(res.data.message || "Doctor not found");
        }
      } catch (error) {
        toast.error("Failed to load doctor");
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) loadDoctor();
  }, [doctorId, backendUrl, aToken]);

  /* ---------- Handlers ---------- */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "available") {
          fd.append(key, value ? "true" : "false");
        } else {
          fd.append(key, value);
        }
      });

      if (image) fd.append("image", image);

      const res = await axios.patch(
        `${backendUrl}/api/admin/doctor/${doctorId}`,
        fd,
        {
          headers: {
            atoken: aToken,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success("Doctor updated successfully");
        navigate(-1);
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch (error) {
      toast.error("Update failed");
    }
  };

  /* ---------- Loader ---------- */
  if (loading) {
    return (
      <Loader
        title="Loading Doctor..."
        subtitle="Please wait"
      />
    );
  }

  /* ---------- JSX ---------- */
  return (
    <EditDoctorForm
      form={form}
      setForm={setForm}
      preview={preview}
      handleImageChange={handleImageChange}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      navigate={navigate}
    />
  );
};

export default EditDoctor;
