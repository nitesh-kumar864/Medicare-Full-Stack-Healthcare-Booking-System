import React from "react";

const RefundPolicy = () => {
  return (
    <div className="pt-24 px-4 md:px-20 lg:px-32 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Refund <span className="text-primary">Policy</span>
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

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
          1. Appointment Cancellation
        </h2>
        <p>
          Appointment cancellations are handled by the MediCare admin team.
          Users may request cancellation by contacting our support team
          before the scheduled appointment time.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
          2. Refund Eligibility
        </h2>
        <ul className="list-disc ml-5">
          <li>
            Refunds are applicable only for appointments cancelled within
            the eligible time period as defined by the platform.
          </li>
          <li>
            Late cancellations or missed appointments may not be eligible
            for a refund.
          </li>
        </ul>
        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
          3. Refund Process
        </h2>
        <p>
          The refund process is demonstrated as part of the application workflow.
          In a production environment, eligible refunds would be processed manually
          by the admin through the Razorpay payment gateway after verifying the
          cancellation request.
        </p>


        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
          4. Refund Timeline
        </h2>
        <p>
          Once a refund is initiated, the amount will be credited to the
          original payment method within <b>5–7 working days</b>, depending
          on the bank or payment provider.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
          5. Non-Refundable Cases
        </h2>
        <ul className="list-disc ml-5">
          <li>Missed appointments</li>
          <li>Late cancellation requests</li>
          <li>Appointments already completed</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
          6. Contact Information
        </h2>
        <p>
          For refund-related questions or cancellation requests, please
          contact us through the Help Center or support email provided
          on the website.
        </p>

        <p className="mt-6">
          <b>Note:</b> This refund policy is included to demonstrate how
          cancellation and refund flows work in a real-world application.
          No actual refunds are processed as this platform is used for
          testing and demonstration purposes.
        </p>

      </div>
    </div>
  );
};

export default RefundPolicy;
