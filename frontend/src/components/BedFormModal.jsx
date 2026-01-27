import React, { useState, useEffect } from "react";

const BedFormModal = ({ isOpen, onClose, onSubmit, selectedBed, bedData, userData }) => {
  if (!isOpen) return null;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    purpose: "",
    price: 0,
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    purpose: "",
  });

  // AUTO-FILL USER DATA
  useEffect(() => {
    if (isOpen && userData) {
      setForm((prev) => ({
        ...prev,
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        purpose: "",
      }));
    }
  }, [isOpen, userData]);

  // AUTO PRICE SET 
  useEffect(() => {
    if (isOpen && bedData) {
      let autoPrice = 0;

      if (bedData.bedType === "general") autoPrice = 100;
      if (bedData.bedType === "icu") autoPrice = 250;
      if (bedData.bedType === "emergency") autoPrice = 500;

      setForm((prev) => ({
        ...prev,
        price: autoPrice,
      }));
    }
  }, [isOpen, bedData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // FORM VALIDATION
  const validateForm = () => {
    let newErrors = {};

    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";

    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    else if (form.phone.length !== 10)
      newErrors.phone = "Phone must be 10 digits";

    if (!form.purpose.trim()) newErrors.purpose = "Disease details required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // SUBMIT
  const handleSubmit = () => {
    if (!validateForm()) return;

    if (bedData.occupiedNumbers.includes(selectedBed)) {
      alert(`Bed ${selectedBed} is already occupied!`);
      return;
    }

    onSubmit({
      ...form,
      bedNumber: selectedBed,
      bedType: bedData.bedType,
      price: form.price,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl p-8 animate-fadeIn">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            Book <span className="text-blue-600">Hospital Bed</span>
          </h2>

          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600"
          >
            Close
          </button>
        </div>

        {/* SELECTED BED */}
        <div className="w-full bg-blue-50 text-blue-700 p-3 rounded-lg font-semibold text-center mb-6 border border-blue-200">
          Selected Bed: {selectedBed} ({bedData?.bedType?.toUpperCase()})
        </div>

        {/* PRICE BOX */}
        <div className="w-full bg-green-50 text-green-700 p-3 rounded-lg font-bold text-center mb-8 border border-green-200 text-lg">
          Bed Price: ₹{form.price} /day
        </div>

        {/* FORM FIELDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* NAME */}
          <div>
            <label className="block mb-1 font-medium">Full Name </label>
            <input
              name="name"
              value={form.name}
              onChange={(e) => {
                setErrors({ ...errors, name: "" });
                handleChange(e);
              }}
              placeholder="Enter full name"
              className={`w-full p-3 border rounded-lg bg-gray-50
                ${errors.name ? "border-red-500" : "border-gray-300"}
                focus:ring focus:ring-blue-200`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* EMAIL */}
          <div>
            <label className="block mb-1 font-medium">Email </label>
            <input
              name="email"
              value={form.email}
              onChange={(e) => {
                setErrors({ ...errors, email: "" });
                handleChange(e);
              }}
              placeholder="Enter email"
              className={`w-full p-3 border rounded-lg bg-gray-50
                ${errors.email ? "border-red-500" : "border-gray-300"}
                focus:ring focus:ring-blue-200`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* PHONE */}
          <div>
            <label className="block mb-1 font-medium">Phone Number </label>
            <input
              name="phone"
              value={form.phone}
              onChange={(e) => {
                setErrors({ ...errors, phone: "" });
                handleChange(e);
              }}
              placeholder="Enter phone number"
              className={`w-full p-3 border rounded-lg bg-gray-50
                ${errors.phone ? "border-red-500" : "border-gray-300"}
                focus:ring focus:ring-blue-200`}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          {/* PURPOSE */}
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Patient Disease </label>
            <textarea
              name="purpose"
              value={form.purpose}
              onChange={(e) => {
                setErrors({ ...errors, purpose: "" });
                handleChange(e);
              }}
              placeholder="Write details here..."
              className={`w-full p-3 border rounded-lg bg-gray-50 h-28 resize-none
                ${errors.purpose ? "border-red-500" : "border-gray-300"}
                focus:ring focus:ring-blue-200`}
            ></textarea>
            {errors.purpose && <p className="text-red-500 text-sm mt-1">{errors.purpose}</p>}
          </div>

        </div>

        {/* BUTTONS */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700"
          >
            Confirm Booking
          </button>
        </div>

      </div>
    </div>
  );
};

export default BedFormModal;
