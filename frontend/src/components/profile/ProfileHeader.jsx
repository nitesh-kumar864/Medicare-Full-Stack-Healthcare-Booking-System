

const ProfileHeader = ({
  userData,
  isEdit,
  setIsEdit,
  image,
  setImage,
  errors,
  setErrors,
  setUserData,
}) => {
  return (
    <>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          My Profile
        </h1>

        {isEdit && (
          <button
            className="text-sm bg-gray-100 px-4 py-1.5 rounded-full shadow hover:bg-gray-200"
            onClick={() => setIsEdit(false)}
          >
            Cancel
          </button>
        )}
      </div>

      {/* PROFILE IMAGE + NAME */}
      <div className="flex flex-col items-center gap-4 mb-8">
        {isEdit ? (
          <label htmlFor="profile-image">
            <div className="relative cursor-pointer">
              <img
                src={
                  image
                    ? URL.createObjectURL(image)
                    : userData.image
                }
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
              />
              <img
                src={"https://res.cloudinary.com/dozq9qzhh/image/upload/v1769491069/upload_djb6qp.png"}
                className="w-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                bg-white rounded-full p-1 shadow"
              />
            </div>

            <input
              type="file"
              id="profile-image"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
        ) : (
          <img
            src={userData.image}
            className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-md"
          />
        )}

        {isEdit ? (
          <div className="w-full flex flex-col items-center">
            <input
              className={`text-xl w-56 text-center border rounded-lg p-2 bg-gray-50 
              ${errors.name ? "border-red-500" : "border-gray-300"}`}
              value={userData.name}
              onChange={(e) => {
                setErrors({ ...errors, name: "" });
                setUserData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }));
              }}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name}
              </p>
            )}
          </div>
        ) : (
          <p className="text-xl font-semibold">
            {userData.name}
          </p>
        )}
      </div>
    </>
  );
};

export default ProfileHeader;
