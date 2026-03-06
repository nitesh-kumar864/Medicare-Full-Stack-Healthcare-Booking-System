import React, { useEffect, useState } from 'react'
import axios from 'axios';

const Header = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [stats, setStats] = useState({
    doctors: 0,
    appointments: 0,
    patients: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {

        const { data } = await axios.get('http://localhost:4000/api/public/stats');
        if (data.success) {
          setStats(data.stats);
        }

      } catch (error) {
        console.error("fetch error message", error);

      };

    }
     fetchStats();
  }, []);

  return (
    <div className="pt-28">

      {/* HERO WRAPPER */}
      <div className="bg-primary rounded-3xl px-6 md:px-12 lg:px-20 py-12 md:py-16 flex flex-col md:flex-row items-center relative overflow-hidden shadow-xl">

        {/* LEFT CONTENT */}
        <div className="md:w-1/2 space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-5xl font-semibold leading-tight text-white drop-shadow">
            Book Appointments <br /> with Top Doctors
          </h1>

          <p className="text-white text-sm md:text-base font-light leading-relaxed">
            Search through our trusted & verified doctors and book online appointments.
            <br className="hidden md:block" />
          </p>

          <div className="flex items-center justify-center md:justify-start gap-3 mt-3">
            <img
              className="w-24 md:w-28"
              src={"https://res.cloudinary.com/dozq9qzhh/image/upload/v1769459093/group_profiles_if1pyi.png"}
              alt=""
              loading="lazy"
            />
            <p className="text-white text-sm font-light">
              Trusted by hundreds of patients.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
            <a
              href="#speciality"
              className="inline-flex items-center gap-3 bg-white text-gray-700 px-8 py-3 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Book Appointment
              <img className="w-3" src={"https://res.cloudinary.com/dozq9qzhh/image/upload/v1769459149/arrow_icon_q6jx6l.svg"} alt="→" />
            </a>

            <a
              href="/bed-availability"
              className="inline-flex items-center gap-3 bg-white text-gray-700 px-8 py-3 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Check Bed Availability
              <img className="w-3" src={"https://res.cloudinary.com/dozq9qzhh/image/upload/v1769459149/arrow_icon_q6jx6l.svg"} alt="→" />
            </a>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center relative">

          {/* Skeleton */}
          {!imageLoaded && (
            <div className="w-[320px] md:w-[420px] lg:w-[480px] h-[360px] bg-white/20 rounded-xl animate-pulse" />
          )}

          {/* Hero Image */}
          <img
            src={"https://res.cloudinary.com/dozq9qzhh/image/upload/v1769459286/header_img_ffpia4.png"}
            alt="Doctor"
            fetchpriority="high"
            onLoad={() => setImageLoaded(true)}
            className={`w-[320px] md:w-[420px] lg:w-[480px] rounded-xl drop-shadow-xl
              transition-opacity duration-500
              ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-10 max-w-5xl mx-auto">
        {[
          { value: stats.doctors + "+", label: 'Specialist Doctors' },
          { value: '96%', label: 'Patient Satisfaction' },
           { value: stats.patients + "+", label: 'Total patients' },
          { value: stats.appointments + "+", label: 'Appointments Booked' }
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white shadow-md hover:shadow-lg rounded-xl p-5 text-center border border-gray-100 transition-all"
          >
            <p className="text-primary text-3xl font-bold">{stat.value}</p>
            <p className="text-gray-600 text-sm font-medium mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Header
