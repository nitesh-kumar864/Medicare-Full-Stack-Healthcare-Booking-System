import { assets } from "../../assets/assets";

const DoctorForm = ({
  docImg,
  setDocImg,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  experience,
  setExperience,
  fees,
  setFees,
  speciality,
  setSpeciality,
  degree,
  setDegree,
  address1,
  setAddress1,
  address2,
  setAddress2,
  about,
  setAbout,
  onSubmitHandler,
}) => {
  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-5 text-2xl font-semibold text-gray-800">
        Add Doctor
      </p>

      <div className="bg-white px-8 py-8 border rounded-xl w-full max-w-5xl shadow-md">
        {/* IMAGE UPLOAD */}
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="doc-img">
            <img
              className="w-20 h-20 rounded-full object-cover border cursor-pointer"
              src={
                docImg
                  ? URL.createObjectURL(docImg)
                  : assets.upload_area
              }
              alt=""
            />
          </label>
          <input
            type="file"
            id="doc-img"
            hidden
            onChange={(e) => setDocImg(e.target.files[0])}
          />
          <p className="text-sm">Upload doctor picture</p>
        </div>

        {/* GRID FORM */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 text-gray-800 mt-6">
          {/* LEFT SIDE */}
          <div className="flex flex-col gap-6">
            {/* Doctor Name */}
            <div className="flex flex-col gap-1">
              <label className="text-[15px] font-semibold">
                Doctor Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Enter doctor name"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all"
                required
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-[15px] font-semibold">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="example@mail.com"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all"
                required
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="text-[15px] font-semibold">
                Password
              </label>

              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Create password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all pr-14"
                  required
                />
                <span
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-600 cursor-pointer select-none"
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>
            </div>

            {/* Experience */}
            <div className="flex flex-col gap-1">
              <label className="text-[15px] font-semibold">
                Experience
              </label>
              <select
                value={experience}
                onChange={(e) =>
                  setExperience(e.target.value)
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all"
              >
                {[...Array(10)].map((_, i) => {
                  const year = i + 1;
                  return (
                    <option
                      key={i}
                      value={`${year} ${
                        year === 1 ? "Year" : "Years"
                      }`}
                    >
                      {year}{" "}
                      {year === 1 ? "Year" : "Years"}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Fees */}
            <div className="flex flex-col gap-1">
              <label className="text-[15px] font-semibold">
                Consultation Fees
              </label>
              <input
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                type="number"
                placeholder="Enter fees"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col gap-6">
            {/* Speciality */}
            <div className="flex flex-col gap-1">
              <label className="text-[15px] font-semibold">
                Speciality
              </label>
              <select
                value={speciality}
                onChange={(e) =>
                  setSpeciality(e.target.value)
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all"
              >
                <option>General Physician</option>
                <option>Cardiology</option>
                <option>Dermatologist</option>
                <option>Gynecologist</option>
                <option>Orthopedics</option>
                <option>Pediatricians</option>
                <option>Neurologist</option>
                <option>Ophthalmologist</option>
              </select>
            </div>

            {/* Education */}
            <div className="flex flex-col gap-1">
              <label className="text-[15px] font-semibold">
                Education
              </label>
              <input
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                type="text"
                placeholder="MBBS, MD, etc"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all"
                required
              />
            </div>

            {/* Address */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[15px] font-semibold">
                  Address Line 1
                </label>
                <input
                  value={address1}
                  onChange={(e) =>
                    setAddress1(e.target.value)
                  }
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[15px] font-semibold">
                  Address Line 2
                </label>
                <input
                  value={address2}
                  onChange={(e) =>
                    setAddress2(e.target.value)
                  }
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* ABOUT */}
        <div className="mt-6">
          <p className="font-medium mb-2">About Doctor</p>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            rows="5"
            className="w-full border rounded-lg p-3 bg-gray-50 outline-primary"
            placeholder="Write about doctor..."
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-primary px-10 py-3 mt-6 text-white rounded-full hover:bg-blue-600 transition"
        >
          Add Doctor
        </button>
      </div>
    </form>
  );
};

export default DoctorForm;
