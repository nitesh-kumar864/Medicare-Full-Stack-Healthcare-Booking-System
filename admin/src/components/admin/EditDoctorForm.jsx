import React from "react";
import {
  User,
  Stethoscope,
  GraduationCap,
  Clock,
  IndianRupee,
  ImagePlus,
  CheckCircle,
  XCircle,
} from "lucide-react";

/* ---------- Reusable Input ---------- */
const InputField = ({ icon: Icon, label, ...props }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-600">
        {label}
      </label>
      <div className="flex items-center gap-2 border rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
        <Icon size={18} className="text-gray-400 shrink-0" />
        <input
          {...props}
          className="w-full outline-none bg-transparent text-sm"
        />
      </div>
    </div>
  );
};

/* ---------- MAIN FORM ---------- */
const EditDoctorForm = ({
  form,
  setForm,
  preview,
  handleImageChange,
  handleChange,
  handleSubmit,
  navigate,
}) => {
  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-3">
          Edit Doctor
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image */}
          <div className="flex flex-col items-center gap-3">
            <img
              src={preview}
              alt="Doctor"
              className="bg-blue-600 w-36 h-36 rounded-full object-cover border"
            />

            <label className="flex items-center gap-2 text-sm text-blue-600 cursor-pointer">
              <ImagePlus size={18} />
              Change Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />
            </label>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              icon={User}
              label="Doctor Name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />

            <InputField
              icon={Stethoscope}
              label="Speciality"
              name="speciality"
              value={form.speciality}
              onChange={handleChange}
            />

            <InputField
              icon={GraduationCap}
              label="Degree"
              name="degree"
              value={form.degree}
              onChange={handleChange}
            />

            <InputField
              icon={Clock}
              label="Experience (Years)"
              name="experience"
              value={form.experience}
              onChange={handleChange}
            />

            <InputField
              icon={IndianRupee}
              label="Fees"
              name="fees"
              value={form.fees}
              onChange={handleChange}
            />
          </div>

          {/* Availability */}
          <div className="flex items-center gap-3">
            <span className="font-medium">Availability:</span>

            {form.available ? (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                <CheckCircle size={16} /> Available
              </span>
            ) : (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">
                <XCircle size={16} /> Unavailable
              </span>
            )}

            <button
              type="button"
              onClick={() =>
                setForm({ ...form, available: !form.available })
              }
              className="ml-3 text-sm text-blue-600 underline"
            >
              Change
            </button>
          </div>

          {/* About */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              About
            </label>
            <textarea
              name="about"
              value={form.about}
              onChange={handleChange}
              rows={4}
              className="w-full mt-1 p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDoctorForm;
