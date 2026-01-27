const ProfileActions = ({
  isEdit,
  setIsEdit,
  updateUserProfileData,
  updating,
}) => {
  return (
    <div className="mt-8 flex gap-4">
      {isEdit ? (
        <>
          <button
            onClick={updateUserProfileData}
            disabled={updating}
            className="bg-primary text-white px-6 py-2 rounded-full shadow hover:opacity-90 w-full disabled:opacity-50"
          >
            {updating ? "Saving..." : "Save Changes"}
          </button>

          <button
            onClick={() => setIsEdit(false)}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-full shadow hover:bg-gray-300 w-full"
          >
            Cancel
          </button>
        </>
      ) : (
        <button
          onClick={() => setIsEdit(true)}
          className="bg-primary text-white px-6 py-2 rounded-full shadow hover:opacity-90 w-full"
        >
          Edit Profile
        </button>
      )}
    </div>
  );
};

export default ProfileActions;
