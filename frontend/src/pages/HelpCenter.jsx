import React, { useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const HelpCenter = () => {
  const { backendUrl, token, userData } = useContext(AppContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


  const [errors, setErrors] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const [formData, setFormData] = useState({
    name: userData?.name || "",
    email: userData?.email || "",
    subject: "",
    message: "",
  });

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;


    // If not logged in → force login first
    if (!token) {
      toast.warn("Please login to submit a query.");
      return navigate("/login", {
        state: { from: "/help-center" },
      });

    }


    try {
      setLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/support/create`,
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        setFormData({ ...formData, subject: "", message: "" });
        navigate("/my-support");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 px-4 md:px-10 lg:px-20 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Help  <span className='text-blue-600'>Center</span> </h1>
        <p className="text-center text-gray-600 mb-8">
          We usually respond within <span className="font-bold">24 hours</span>.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md border rounded-2xl p-8"
        >
          {/* -------- GRID TWO COLUMN LAYOUT -------- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* NAME */}
            <div>
              <label className="text-sm font-semibold">Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={(e) => {
                  setErrors({ ...errors, name: "" });
                  onChange(e);
                }}
                placeholder="Your Name"
                className={`w-full p-3 border rounded-lg mt-1 bg-gray-50 
      ${errors.name ? "border-red-500" : "border-gray-300"}
      focus:ring-2 focus:ring-primary outline-none`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>


            {/* EMAIL */}
            <div>
              <label className="text-sm font-semibold">Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={(e) => {
                  setErrors({ ...errors, email: "" });
                  onChange(e);
                }}
                placeholder="Your Email"
                className={`w-full p-3 border rounded-lg mt-1 bg-gray-50 
      ${errors.email ? "border-red-500" : "border-gray-300"}
      focus:ring-2 focus:ring-primary outline-none`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* SUBJECT */}
            <div className="md:col-span-2">
              <label className="text-sm font-semibold">Subject</label>
              <input
                name="subject"
                value={formData.subject}
                onChange={(e) => {
                  setErrors({ ...errors, subject: "" });
                  onChange(e);
                }}
                placeholder="Short Title"
                className={`w-full p-3 border rounded-lg mt-1 bg-gray-50 
      ${errors.subject ? "border-red-500" : "border-gray-300"}
      focus:ring-2 focus:ring-primary outline-none`}
              />
              {errors.subject && (
                <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
              )}
            </div>


            {/* MESSAGE */}
            <div className="md:col-span-2">
              <label className="text-sm font-semibold">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={(e) => {
                  setErrors({ ...errors, message: "" });
                  onChange(e);
                }}
                placeholder="Describe your issue"
                rows={5}
                className={`w-full p-3 border rounded-lg mt-1 bg-gray-50 resize-none
      ${errors.message ? "border-red-500" : "border-gray-300"}
      focus:ring-2 focus:ring-primary outline-none`}
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message}</p>
              )}
            </div>


          </div>

          {/* BUTTONS */}

          <div className="mt-8 flex justify-end gap-4">

            {/* CANCEL BUTTON */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 rounded-lg text-lg font-medium transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-primary text-white hover:opacity-90"}`}
            >
              {loading ? "submitting..." : "submit query"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );

};

export default HelpCenter;
