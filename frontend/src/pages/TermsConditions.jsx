import React from "react";

const TermsConditions = () => {
  return (
    <div className="pt-24 px-4 md:px-20 lg:px-32 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Terms & <span className="text-primary">Conditions</span>
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
        <p>
          Welcome to <strong>Medicare</strong>. By accessing or using our
          website, you agree to be bound by these Terms & Conditions.
          If you do not agree, please do not use our services.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
          1. Account Registration
        </h2>
        <p>
          Users may create an account to explore appointment features. You are responsible
          for safeguarding your login credentials and for all activities performed under your account.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
          2. Appointment System
        </h2>
        <p>
          MediCare is an educational healthcare appointment booking platform.
          The platform does not provide real medical consultations or treatment services.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
          3. User Responsibilities
        </h2>
        <ul className="list-disc ml-5">
          <li>Provide accurate information during registration</li>
          <li>Avoid any misuse or harmful activity within the platform</li>
          <li>Use the website respectfully and for learning purposes only</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
          4. No Real Medical Advice
        </h2>
        <p>
          MediCare does <b>not</b> provide medical advice, diagnosis, or treatment.
          All doctor profiles, schedules, and details are project-based placeholders.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
          5. Payments & Refunds
        </h2>
        <p>
          Payments on the MediCare platform are processed securely using the Razorpay payment gateway.
          Users may be required to log in before completing a payment.
        </p>

        <ul className="list-disc ml-5 mt-2">
          <li>Payments are made for appointment booking purposes only</li>
          <li>Appointment cancellations are handled by the admin</li>
          <li>
            If a cancellation is eligible as per our refund policy, refunds are processed manually
            by the admin through the payment gateway
          </li>
          <li>
            Refunds, if applicable, are credited to the original payment method within
            5–7 working days depending on the bank
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
          6. Intellectual Property
        </h2>
        <p>
          All UI, assets, and written content in this project are for academic purposes.
          Any referenced assets belong to their respective owners.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
          7. Modification of Terms
        </h2>
        <p>
          These Terms & Conditions may be updated anytime to improve clarity or functionality.
          Continued use of the website means you accept the updated terms.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
          8. Contact Information
        </h2>
        <p>
          For questions related to these Terms, please contact us through the Help Center page.
        </p>
        <div>
          <p className="mb-4 mt-4">
            <span><b>Note:&nbsp;</b></span>
            This platform is an educational project and is not associated with any official
            medical organization or brand named “MediCare”.
          </p>
        </div>

      </div>
    </div>
  );
};

export default TermsConditions;
