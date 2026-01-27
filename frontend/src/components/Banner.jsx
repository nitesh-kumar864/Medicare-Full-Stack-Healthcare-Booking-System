import React from 'react'
import { useNavigate } from 'react-router-dom'

const  APPOINTMENT_IMG = "https://res.cloudinary.com/dozq9qzhh/image/upload/v1769458341/appointment_img_ljvtao.png"

const Banner = () => {
  const navigate = useNavigate()

  return (
    <div className='flex bg-primary rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10'>

      {/* -------- left side -------- */}
      <div className='flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5'>
        <div className='text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-white'>
          <p>Book Appointment</p>
          <p className='mt-4'>With 20+ Trusted Doctors</p>
        </div>

        <button
          onClick={() => {
            navigate('/login')
            window.scrollTo(0, 0)
          }}
          className='bg-white text-sm sm:text-base text-gray-600 px-8 py-3 rounded-full mt-6 hover:scale-105 transition-all'
        >
          Create account
        </button>
      </div>

      {/* -------- right side (DESKTOP ONLY) -------- */}
      <div className="flex md:w-1/2 lg:w-[370px] relative items-end justify-end">
        <img
          src={APPOINTMENT_IMG}
          alt="Appointment"
          loading="lazy"
          className="
      w-40 mx-auto mt-6           
      sm:w-56
      md:w-full md:mt-0         
    "
        />
      </div>

    </div>
  )
}

export default Banner
