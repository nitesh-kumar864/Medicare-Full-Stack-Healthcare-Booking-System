import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom';

const RelatedDoctor = ({ speciality, docId }) => {

  const { doctors, getDoctorsData } = useContext(AppContext);
  const navigate = useNavigate();

  const [relDoc, setRelDocs] = useState([]);

  const handleNavigate = (url) => navigate(url);

  // Load doctors here also
  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const doctorData = doctors.filter(
        (doc) =>
          doc.speciality.toLowerCase() === speciality.toLowerCase() &&
          doc._id !== docId
      );
      setRelDocs(doctorData);
    }
  }, [doctors, speciality, docId]);

  return (


    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
      <h1 className='text-3xl font-medium'>Related Doctors</h1>

      <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-5 gap-y-6 sm:px-0'>
        {relDoc.slice(0, 5).map((item, index) => {

          const isAvailable = item.available === true;

          return (
            <div
              key={index}
              onClick={() => handleNavigate(`/appointments/${item._id}`)}
              className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500'
            >
              <div className='relative'>
                <img
                  className="w-full h-60 object-contain sm:object-cover"
                  src={item.image}
                  alt={item.name}
                />

                {/* Rating badge */}
                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full shadow text-sm flex items-center gap-1">
                  <span className="text-yellow-500">⭐</span>
                  <span className="text-gray-700">{item.averageRating || "0.0"}</span>
                </div>
              </div>

              <div className='p-4'>
                <div
                  className={`flex items-center gap-2 text-sm ${isAvailable ? "text-green-500" : "text-gray-500"
                    }`}
                >
                  <p
                    className={`w-2 h-2 rounded-full ${isAvailable ? "bg-green-500" : "bg-gray-400"
                      }`}
                  ></p>

                  <p>{isAvailable ? "Available" : "Not Available"}</p>
                </div>

                <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                <p className='text-gray-600 text-sm'>{item.speciality}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default RelatedDoctor
