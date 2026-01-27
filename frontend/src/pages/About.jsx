import React, { useState } from "react";

const About = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="pt-24">
      <div className="px-4 md:px-20 lg:px-32 py-10">

        {/* Heading */}
        <div className="text-center text-2xl font-bold text-gray-700 mb-8">
          ABOUT <span className="text-primary">US</span>
        </div>

        {/* About Section */}
        <div className="my-10 flex flex-col md:flex-row gap-12 items-center">

          {/* Image Container */}
          <div className="w-full md:max-w-[360px]">

            {/* Skeleton */}
            {!imageLoaded && (
              <div className="h-64 w-full bg-gray-200 animate-pulse rounded-lg shadow-lg" />
            )}

            {/* Image */}
            <img
              src={"https://res.cloudinary.com/dozq9qzhh/image/upload/v1769459741/about_image_lvleym.png"}
              alt="About Us"
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              className={`w-full rounded-lg shadow-lg transition-opacity duration-500 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>

          {/* Text */}
          <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
            <p>
              Welcome to <strong>MediCare</strong>, your companion in accessing healthcare
              more conveniently. Our platform allows users to find doctors, book appointments,
              and manage essential health information with ease.
            </p>

            <p>
              At MediCare, we focus on providing a smooth and user-friendly experience.
              Whether you’re booking your first appointment or managing routine checkups,
              our goal is to make your healthcare journey simple and efficient.
            </p>

            <b className="text-gray-800 text-base">Our Vision</b>

            <p>
              Our vision is to create a seamless connection between patients and healthcare
              providers. We want to make healthcare accessible, organized, and stress-free
              for everyone.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="text-xl font-semibold text-gray-700 mb-6">
          WHY <span className="text-primary">CHOOSE US</span>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-16">
          {[
            {
              title: "EFFICIENCY",
              desc: "Fast and simple appointment scheduling designed for a busy lifestyle."
            },
            {
              title: "CONVENIENCE",
              desc: "Easily browse and connect with trusted healthcare professionals around you."
            },
            {
              title: "PERSONALIZATION",
              desc: "Get tailored suggestions and stay organized with reminders and updates."
            }
          ].map((item, index) => (
            <div
              key={index}
              className="border px-10 py-6 flex flex-col gap-3 text-[15px]
              hover:bg-primary hover:text-white transition-all duration-300
              text-gray-600 rounded-lg shadow-md cursor-pointer"
            >
              <b>{item.title}:</b>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
