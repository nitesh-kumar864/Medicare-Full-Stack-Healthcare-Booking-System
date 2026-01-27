import React from "react";

const ProfileDetails = ({
  profileData,
  isEdit,
  setIsEdit,
  setProfileData,
  updateProfile,
  isActionLoading,
}) => {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* ---------- TOP CARD WITH IMAGE ---------- */}
      <div className="bg-white shadow-sm rounded-xl p-6 flex flex-col sm:flex-row gap-6">
        {/* Doctor Image */}
        <div className="flex justify-center sm:block">
          <img
            src={profileData.image}
            alt=""
            className="w-40 h-40 rounded-xl object-cover shadow-md border bg-primary"
          />
        </div>

        {/* Doctor Header Info */}
        <div className="flex-1">
          <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-3">
            {profileData.name}
          </h2>

          <p className="text-gray-600 mt-1">
            {profileData.degree} • {profileData.speciality}
          </p>

          <p className="text-sm bg-blue-100 text-blue-700 w-fit px-3 py-1 rounded-full mt-2">
            {profileData.experience}
          </p>

          <p className="text-gray-700 font-medium mt-4">About</p>
          <p className="text-gray-600 text-sm leading-6 max-w-xl">
            {profileData.about}
          </p>
        </div>
      </div>

      {/* ---------- EDITABLE SECTION ---------- */}
      <div className="mt-8 bg-white shadow-sm rounded-xl p-6">
        {/* Consultation Fees */}
        <div className="mb-5">
          <p className="text-gray-700 font-medium mb-1">
            Consultation Fees
          </p>
          {isEdit ? (
            <input
              className="border rounded-lg px-3 py-2 w-40 text-gray-700"
              type="number"
              value={profileData.fees}
              onChange={(e) =>
                setProfileData((prev) => ({
                  ...prev,
                  fees: e.target.value,
                }))
              }
            />
          ) : (
            <p className="text-lg font-semibold text-gray-800">
              ₹{profileData.fees}
            </p>
          )}
        </div>

        {/* Address */}
        <div className="mb-5">
          <p className="text-gray-700 font-medium mb-1">
            Address:
          </p>

          {isEdit ? (
            <>
              <input
                className="border rounded-lg px-3 py-2 w-full mb-3"
                type="text"
                value={profileData.address.line1}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    address: {
                      ...prev.address,
                      line1: e.target.value,
                    },
                  }))
                }
              />

              <input
                className="border rounded-lg px-3 py-2 w-full"
                type="text"
                value={profileData.address.line2}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    address: {
                      ...prev.address,
                      line2: e.target.value,
                    },
                  }))
                }
              />
            </>
          ) : (
            <p className="text-gray-600 leading-6">
              {profileData.address.line1} <br />
              {profileData.address.line2}
            </p>
          )}
        </div>

        {/* Availability */}
        <div className="mb-5 flex items-center gap-3">
          <input
            type="checkbox"
            checked={profileData.available}
            onChange={() =>
              isEdit &&
              setProfileData((prev) => ({
                ...prev,
                available: !prev.available,
              }))
            }
            className="w-5 h-5 cursor-pointer"
          />
          <p className="text-gray-700">
            Available for Appointments
          </p>
        </div>

        {/* Buttons */}
        {isEdit ? (
          <button
            disabled={isActionLoading}
            onClick={updateProfile}
            className="px-6 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isActionLoading ? "Saving..." : "Save Changes"}
          </button>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className="px-6 py-2 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileDetails;
