import React from "react";

const DoctorInfo = ({ docInfo, currencySymbol }) => {
  if (!docInfo) return null;

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Doctor Image */}
      <img
        className="bg-primary w-full sm:max-w-72 rounded-lg"
        src={docInfo.image}
        alt={docInfo.name}
      />

      {/* Doctor Details */}
      <div className="flex-1 border border-gray-300 rounded-lg p-6 bg-white">
        <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
          {docInfo.name}
          <img
            className="w-5"
            src="https://res.cloudinary.com/dozq9qzhh/image/upload/v1769461384/verified_icon_ocdlvt.svg"
            alt="verified"
          />
        </p>

        <p className="text-sm text-gray-600 mt-1">
          {docInfo.degree} – {docInfo.speciality}
        </p>

        <p className="mt-4 text-gray-700 font-semibold">
          Experience:
          <span className="ml-2 inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
            {docInfo.experience}
          </span>
        </p>

        {/* Address */}
        <div className="mt-2 text-gray-700 font-semibold">
          Address:
          <span className="text-gray-600 font-normal">
            {" "}
            {docInfo.address?.line1}, {docInfo.address?.line2}
          </span>
        </div>

        <p className="mt-2 text-gray-700 font-semibold">
          About:
          <span className="text-gray-600 font-normal">
            {" "}
            {docInfo.about}
          </span>
        </p>

        <p className="mt-4 text-gray-700 font-semibold">
          Appointment fee:
          <span className="text-gray-900">
            {" "}
            {currencySymbol}
            {docInfo.fees}
          </span>
        </p>
      </div>
    </div>
  );
};

export default DoctorInfo;
