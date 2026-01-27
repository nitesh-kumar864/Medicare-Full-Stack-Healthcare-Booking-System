import React, { useState } from "react";

const Contact = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="pt-24 bg-gray-50 min-h-screen">

      {/* Page Heading */}
      <div className="text-center text-4xl font-bold pt-5 text-gray-700">
        CONTACT <span className="text-blue-600">US</span>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 px-6 my-16">

        {/* Image Card */}
        <div className="w-full md:max-w-md bg-white shadow-xl rounded-2xl p-8">

          {/* Skeleton */}
          {!imageLoaded && (
            <div className="h-64 w-full bg-gray-200 animate-pulse rounded-xl"></div>
          )}

          {/* Image  */}
          <img
            src={"https://res.cloudinary.com/dozq9qzhh/image/upload/v1769459850/contact_image_lcusn9.png"}
            alt="Contact"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`w-full rounded-xl transition-opacity duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        {/* Contact Section */}
        <div className="w-full md:max-w-lg bg-white shadow-xl rounded-2xl p-8 flex flex-col gap-6">

          <p className="font-semibold text-2xl text-gray-800">GET IN TOUCH</p>

          <p className="text-gray-600 leading-relaxed">
            If you have questions, suggestions, or need assistance related to
            this platform, feel free to reach out. I’m always happy to help.
          </p>

          <div className="space-y-3">
            <p className="font-semibold text-lg">Support Center</p>

            <p className="text-gray-600">
              Please create a support ticket. All responses are handled directly
              through the platform.
            </p>

            <button
              onClick={() => (window.location.href = "/help-center")}
              className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
            >
              Create Support Ticket
            </button>

            <p className="text-sm text-gray-500">
              You’ll receive replies inside the platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
