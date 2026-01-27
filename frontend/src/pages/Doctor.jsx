import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import {
  Filter,
  Stethoscope,
  Baby,
  Brain,
  Heart,
  Venus,
  Sun,
  Bone,
  Eye
} from "lucide-react";

const Doctor = () => {
  const { speciality } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { doctors } = useContext(AppContext);

  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [search, setSearch] = useState("");

  const selectedSpeciality = speciality
    ? decodeURIComponent(speciality).toLowerCase()
    : null;

  const searchQuery = search.toLowerCase();

  const specialityList = [
    { name: "General Physician", icon: Stethoscope },
    { name: "Pediatricians", icon: Baby },
    { name: "Neurologist", icon: Brain },
    { name: "Cardiology", icon: Heart },
    { name: "Gynecologist", icon: Venus },
    { name: "Dermatologist", icon: Sun },
    { name: "Orthopedics", icon: Bone },
    { name: "Ophthalmologist", icon: Eye },
  ];

  const applyFilter = () => {
    let result = doctors;

    if (selectedSpeciality) {
      result = result.filter(
        (doc) => doc.speciality.toLowerCase() === selectedSpeciality
      );
    }

    if (searchQuery.length >= 3) {
      result = result.filter((doc) =>
        doc.name.toLowerCase().includes(searchQuery)
      );
    }

    setFilterDoc(result);
  };

  useEffect(() => {
    if (doctors && doctors.length > 0) applyFilter();
  }, [doctors, selectedSpeciality, search]);

  return (
    <div className="pt-24">
      <div className="pb-10">

        <p className="text-gray-600">Browse through the specialists.</p>

        {/* Search */}
        <div className="w-full sm:w-1/2 mt-4">
          <div className="flex items-center gap-3 px-4 py-3 border rounded-full shadow-sm bg-white">
            <input
              type="text"
              placeholder="Search doctor by name..."
              className="w-full outline-none text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">

          {/* FILTER TOGGLE BUTTON (Mobile) */}
          <button
            className={`flex items-center gap-2 py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? "bg-primary text-white" : ""
              }`}
            onClick={() => setShowFilter((prev) => !prev)}
          >
            <Filter size={16} />
            Filter
          </button>

          {/* SPECIALITY FILTER LIST */}
          <div
            className={`flex-col gap-3 text-sm ${showFilter ? "flex" : "hidden sm:flex"
              }`}
          >
            {specialityList.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  onClick={() =>
                    speciality === item.name
                      ? navigate("/doctors")
                      : navigate(`/doctors/${encodeURIComponent(item.name)}`)
                  }
                  className={`
                    cursor-pointer px-4 py-2 rounded-full border shadow-sm 
                    flex items-center gap-2 transition-all duration-300 select-none

                    ${speciality === item.name
                      ? "bg-primary text-white border-primary scale-[1.03] shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
                    }
                  `}
                >
                  <Icon size={16} />
                  {item.name}
                </div>
              );
            })}
          </div>

          {/* DOCTOR LIST */}
          <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
            {filterDoc.length > 0 ? (
              filterDoc.map((item, index) => (
                <div
                  key={index}
                  onClick={() => navigate(`/appointments/${item._id}`)}
                  className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500"
                >
                  <img
                    className="w-full h-60 object-contain sm:object-cover"
                    src={item.image}
                    alt={item.name}
                  />

                  <div className="p-4">
                    <div
                      className={`flex items-center gap-2 text-sm ${item.available ? "text-green-500" : "text-gray-500"
                        }`}
                    >
                      <p
                        className={`w-2 h-2 rounded-full ${item.available ? "bg-green-500" : "bg-gray-400"
                          }`}
                      ></p>
                      <p>{item.available ? "Available" : "Not Available"}</p>
                    </div>

                    <p className="text-gray-900 text-lg font-medium">
                      {item.name}
                    </p>
                    <p className="text-gray-600 text-sm">{item.speciality}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No doctors found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctor;
