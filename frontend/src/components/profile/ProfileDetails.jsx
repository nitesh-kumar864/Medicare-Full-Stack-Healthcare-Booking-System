const ProfileDetails = ({
  userData,
  isEdit,
  isUsernameEdit,
  setIsUsernameEdit,
  newUsername,
  setNewUsername,
  usernameStatus,
  isUsernameValid,
  checkingUsername,
  checkUsernameAvailability,
  changeUsername,
  errors,
  setErrors,
  setUserData,
  formatDate,
}) => {
  return (
    <>
      {/* USERNAME */}
      <div className="border-b pb-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Username</span>

            {!isUsernameEdit ? (
              <span className="font-semibold text-gray-900">
                @{userData.username}
              </span>
            ) : (
              <input
                autoFocus
                type="text"
                value={newUsername}
                onChange={(e) =>
                  checkUsernameAvailability(e.target.value)
                }
                className="border rounded-md px-2 py-1 text-sm w-40 sm:w-48
                focus:ring-2 focus:ring-primary outline-none mr-2"
              />
            )}
          </div>

          {!isUsernameEdit ? (
            <button
              onClick={() => {
                setIsUsernameEdit(true);
                setNewUsername(userData.username);
              }}
              className="text-primary text-sm font-medium hover:underline"
            >
              Change
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                disabled={!isUsernameValid || checkingUsername}
                onClick={async () => {
                  await changeUsername();
                  setIsUsernameEdit(false);
                }}
                className="text-primary text-sm font-semibold disabled:opacity-40"
              >
                Save
              </button>

              <button
                onClick={() => {
                  setIsUsernameEdit(false);
                  setNewUsername("");
                }}
                className="text-gray-400 text-sm hover:text-gray-600"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* USERNAME STATUS */}
        {isUsernameEdit && (
          <div className="pl-[72px] mt-1">
            {checkingUsername && (
              <p className="text-xs text-gray-400">
                Checking availability…
              </p>
            )}
            {usernameStatus && (
              <p
                className={`text-xs ${isUsernameValid
                    ? "text-green-600"
                    : "text-red-500"
                  }`}
              >
                {usernameStatus}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="space-y-5">
        {/* EMAIL */}
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Email</span>
          <span className="font-medium text-gray-900">
            {userData.email}
          </span>
        </div>

        {/* PHONE */}
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Phone</span>

          {isEdit ? (
            <>
              <div className="flex gap-2 mt-1">
                <input
                  className="border rounded-md px-3 py-2 w-20 text-sm bg-gray-50"
                  value={userData.countryCode || "+91"}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, "");
                    value = "+" + value.slice(0, 3);
                    setUserData((prev) => ({
                      ...prev,
                      countryCode: value,
                    }));
                  }}
                />

                <input
                  className={`border rounded-md px-3 py-2 w-full text-sm bg-gray-50
                  ${errors.phone
                      ? "border-red-500"
                      : "border-gray-300"
                    }`}
                  value={userData.phone}
                  onChange={(e) => {
                    setErrors({ ...errors, phone: "" });
                    let value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10);
                    setUserData((prev) => ({
                      ...prev,
                      phone: value,
                    }));
                  }}
                />
              </div>

              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.phone}
                </p>
              )}
            </>
          ) : (
            <span className="font-medium text-gray-900 mt-1">
              {userData.countryCode || "+91"} {userData.phone}
            </span>
          )}
        </div>

        {/* ADDRESS */}
        <div>
          <label className="text-sm text-gray-600">
            Address
          </label>

          {isEdit ? (
            <div className="flex flex-col gap-2 mt-1">
              <input
                className="border rounded-lg p-2 bg-gray-50"
                value={userData.address.line1}
                placeholder="Address line 1"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: {
                      ...prev.address,
                      line1: e.target.value,
                    },
                  }))
                }
              />
              <input
                className="border rounded-lg p-2 bg-gray-50"
                value={userData.address.line2}
                placeholder="Address line 2"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: {
                      ...prev.address,
                      line2: e.target.value,
                    },
                  }))
                }
              />
            </div>
          ) : (
            <p className="mt-1">
              {userData.address.line1}
              <br />
              {userData.address.line2}
            </p>
          )}
        </div>
      </div>

      <hr className="my-6" />

      {/* BASIC INFO */}
      <p className="text-gray-700 font-semibold mb-2">
        Basic Information
      </p>

      <div className="space-y-4">
        {/* GENDER */}
        <div className="flex items-center gap-10">
          <label className="text-sm text-gray-600 w-32">
            Gender
          </label>

          {isEdit ? (
            <div className="flex-1">
              <select
                className={`border bg-gray-50 rounded-lg p-2 mt-1 w-full
                ${errors.gender
                    ? "border-red-500"
                    : "border-gray-300"
                  }`}
                value={userData.gender || ""}
                onChange={(e) => {
                  setErrors({ ...errors, gender: "" });
                  setUserData((prev) => ({
                    ...prev,
                    gender: e.target.value,
                  }));
                }}
              >
                <option value="">Choose Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.gender}
                </p>
              )}
            </div>
          ) : (
            <p className="font-medium mt-1">
              {userData.gender}
            </p>
          )}
        </div>

        {/* DOB */}
        <div className="flex items-center gap-10">
          <label className="text-sm text-gray-600 w-32">
            Date of Birth
          </label>

          {isEdit ? (
            <div className="flex-1">
              <input
                type="date"
                className={`border bg-gray-50 rounded-lg p-2 mt-1 w-full
                ${errors.dob
                    ? "border-red-500"
                    : "border-gray-300"
                  }`}
                value={userData.dob}
                onChange={(e) => {
                  setErrors({ ...errors, dob: "" });
                  setUserData((prev) => ({
                    ...prev,
                    dob: e.target.value,
                  }));
                }}
              />
              {errors.dob && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.dob}
                </p>
              )}
            </div>
          ) : (
            <p className="font-medium mt-1">
              {formatDate(userData.dob)}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfileDetails;
