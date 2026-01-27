import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

import {
  Stethoscope,
  GraduationCap,
  Clock,
  IndianRupee,
  FileText,
  MapPin,
  CheckCircle,
  XCircle,
  Pencil,
  Trash2,
} from "lucide-react";

const DoctorDetails = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { backendUrl, aToken } = useContext(AdminContext);

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------- Fetch Doctor ---------- */
  const fetchDoctor = async () => {
    try {
      const res = await axios.get(
        `${backendUrl}/api/admin/doctor/${doctorId}`,
        {
          headers: { atoken: aToken },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setDoctor(res.data.doctor);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to load doctor details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctor();
  }, []);

  /* ---------- Delete ---------- */
  const deleteDoctor = async () => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;

    try {
      const res = await axios.delete(
        `${backendUrl}/api/admin/doctor/${doctorId}`,
        {
          headers: { atoken: aToken },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success("Doctor deleted successfully");
        navigate("/admin/doctors-list");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to delete doctor");
    }
  };

  if (loading) {
    return (
      <Loader
        title="Loading Doctor Details"
        subtitle="Fetching doctor information..."
      />
    );
  }

  if (!doctor) {
    return (
      <p className="p-6 text-red-600 font-semibold">
        Doctor not found.
      </p>
    );
  }

  return (
    <div className=" min-h-screen bg-gray-100 p-6">
      <div className=" bg-blue-600/10 max-w-5xl mx-auto bg-white rounded-xl shadow p-6">
        {/* Header */}
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          {doctor.name}
        </h1>

        {/* Content */}
        <div className=" flex flex-col md:flex-row gap-8">
          {/* Image */}
          <img
            src={doctor.image}
            alt="doctor"
            className="w-60 h-60 bg-blue-600 rounded-xl object-cover border"
          />

          {/* Details */}
          <div className="flex-1 space-y-3 text-gray-700">
            <p className="flex items-center gap-2">
              <Stethoscope size={18} className="text-blue-600" />
              <strong>Speciality:</strong> {doctor.speciality}
            </p>

            <p className="flex items-center gap-2">
              <GraduationCap size={18} className="text-blue-600" />
              <strong>Degree:</strong> {doctor.degree}
            </p>

            <p className="flex items-center gap-2">
              <Clock size={18} className="text-blue-600" />
              <strong>Experience:</strong> {doctor.experience}
            </p>

            <p className="flex items-center gap-2">
              <IndianRupee size={18} className="text-blue-600" />
              <strong>Fees:</strong> ₹{doctor.fees}
            </p>

            <p className="flex items-start gap-2">
              <FileText size={18} className="text-blue-600 mt-1" />
              <strong>About:</strong> {doctor.about}
            </p>

            <p className="flex items-start gap-2">
              <MapPin size={18} className="text-blue-600 mt-1" />
              <strong>Address:</strong>{" "}
              {doctor.address?.line1},{" "}
              {doctor.address?.line2},{" "}
              {doctor.address?.city}
            </p>

            <p className="flex items-center gap-2">
              <strong>Available:</strong>
              {doctor.available ? (
                <span className="flex items-center gap-1 text-green-600 font-semibold">
                  <CheckCircle size={16} /> Yes
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-600 font-semibold">
                  <XCircle size={16} /> No
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-10">
          <button
            onClick={() => navigate(`/admin/edit-doctor/${doctorId}`)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            <Pencil size={18} />
            Edit
          </button>

          <button
            onClick={deleteDoctor}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
