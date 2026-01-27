import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="pt-24 px-4 md:px-20 lg:px-32 py-10">

      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Privacy <span className="text-primary"> Policy</span>
      </h1>

      <div
        className="relative bg-gray-100 p-6 rounded-lg shadow-lg shadow-gray-300
        text-gray-700 leading-relaxed text-sm md:text-base mb-14 overflow-hidden"
      >

        {/* ---- Logo ---- */}
        <div className="flex justify-center mb-4 relative z-10">
          <img
            src="https://res.cloudinary.com/dozq9qzhh/image/upload/v1769458899/logo_wkn1e5.png"
            alt="MediCare Logo"
            className="h-14 md:h-16"
            loading="lazy"
          />
        </div>

        <p className="relative z-10">
          <strong>Medicare</strong> is committed to protecting your privacy. We collect and use your
          information only to provide secure and reliable services.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2 relative z-10">
          1. Information We Collect
        </h2>
        <p className="relative z-10">
          We may collect basic information such as your name, email, gender, and profile details
          when you create an account or book an appointment. Payment-related information is
          processed securely by our third-party payment gateway and is not stored on our servers.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2 relative z-10">
          2. How We Use Your Information
        </h2>
        <ul className="list-disc ml-5 relative z-10">
          <li>To create and manage your user account</li>
          <li>To allow you to book and view appointments</li>
          <li>To improve website performance and user experience</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2 relative z-10">
          3. Data Security
        </h2>
        <p className="relative z-10">
          Your information is stored securely and used only for providing services on the platform.
          We do not sell or misuse your personal data. Limited data may be shared with trusted
          third-party services such as payment gateways strictly for operational purposes.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2 relative z-10">
          4. Cookies & Tracking
        </h2>
        <p className="relative z-10">
          We may use browser cookies for login sessions and to improve your browsing experience.
          These cookies do not track or store sensitive information.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2 relative z-10">
          5. Third-Party Services
        </h2>
        <p className="relative z-10">
          MediCare (Learner Project) may use services like Cloudinary or image hosting,
          but no personal data is shared with these services intentionally.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2 relative z-10">
          6. Payment Information
        </h2>
        <p className="relative z-10">
          Payments on the MediCare platform are processed securely by Razorpay.
          MediCare does not store or have access to your card details, UPI IDs, or banking information.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2 relative z-10">
          7. Data Retention
        </h2>
        <p className="relative z-10">
          We retain user information only for as long as necessary to provide our services
          and comply with legal or operational requirements.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2 relative z-10">
          8. Your Consent
        </h2>
        <p className="relative z-10">
          By using this website, you agree to the terms mentioned in this Privacy Policy.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2 relative z-10">
          9. Contact Us
        </h2>
        <p className="relative z-10">
          If you have any questions about this Privacy Policy, please reach out through the Help Center page.
        </p>

      </div>
    </div>
  );
};

export default PrivacyPolicy;
