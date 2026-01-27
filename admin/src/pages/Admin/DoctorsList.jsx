import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";

const DoctorsList = () => {
  const navigate = useNavigate();
  const [pageLoading, setPageLoading] = useState(true);

  const {
    doctors,
    aToken,
    getAllDoctors,
    changeAvailability,
  } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      setPageLoading(true);
      getAllDoctors().finally(() => {
        setPageLoading(false);
      });
    }
  }, [aToken]);

  if (pageLoading) {
    return (
      <Loader
        title="Loading Doctors"
        subtitle="Fetching doctors list..."
      />
    );
  }


  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium">All Doctors</h1>

      <div className="w-full flex flex-wrap justify-center gap-4 pt-5 gap-y-6">
        {doctors.map((item, index) => (
          <div
            key={index}
            className="border border-indigo-200 rounded-xl max-w-56 overflow-hidden group cursor-pointer"
            onClick={() => navigate(`/admin/doctor/${item._id}`)} //  Click to show details
          >
            {/* Doctor Image */}
            <img
              className="bg-indigo-50 group-hover:bg-primary transition-all duration-500 w-full h-40 object-cover"
              src={item.image}
              alt={item.name}
            />

            {/* Doctor Information */}
            <div className="p-4">
              <p className="text-neutral-800 text-lg font-medium">{item.name}</p>
              <p className="text-zinc-600 text-sm">{item.speciality}</p>

              {/* Availability Toggle */}
              <div
                className="mt-2 flex items-center gap-1 text-sm"
                onClick={(e) => e.stopPropagation()} //  prevent card click when toggling
              >
                <input
                  type="checkbox"
                  checked={item.available}
                  onChange={() => changeAvailability(item._id)}
                />
                <p>Available</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;
