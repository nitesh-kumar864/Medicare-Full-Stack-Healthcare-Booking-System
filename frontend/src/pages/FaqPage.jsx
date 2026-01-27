import React, { useState } from "react";
const faqs = [
  {
    question: "What is MediCare?",
    answer:
      "MediCare is a learning-based medical appointment booking platform where users can browse doctors, view details, and book simulated appointments online.",
  },
  {
    question: "Is MediCare a real medical service?",
    answer:
      "No. MediCare is a student learning project created for educational and demonstration purposes only. It does not offer real medical consultations.",
  },
  {
    question: "How do I create an account on MediCare?",
    answer:
      "Go to the Sign Up page, enter your basic details, set a password, and complete the registration process to start using the platform.",
  },
  {
    question: "Can I log in using Google?",
    answer:
      "Yes, MediCare supports secure Google Login for quick and easy account access.",
  },
  {
    question: "How do I book an appointment?",
    answer:
      "Visit the Doctors page, choose a doctor, select a date and time slot, and click the 'Book Appointment' button.",
  },
  {
    question: "Where can I check my upcoming or previous appointments?",
    answer:
      "You can view all booked, completed, or cancelled appointments on the 'My Appointments' page after logging in.",
  },
  {
    question: "How do I update my personal details?",
    answer:
      "Go to the 'My Profile' page to edit your name, phone number, gender, date of birth, address, and profile picture.",
  },
  {
    question: "Can I cancel an appointment?",
    answer:
      "Yes. You can cancel any upcoming appointment from the 'My Appointments' page before it is completed.",
  },
  {
    question: "Is online payment supported?",
    answer:
      "Yes. MediCare includes a simulated Razorpay payment flow for learning purposes. Payments shown on the platform are not real.",
  },
  {
    question: "What happens if my online payment fails?",
    answer:
      "If a payment attempt fails, the platform will allow you to retry the payment from the 'My Appointments' page.",
  },
  {
    question: "How secure is my personal information?",
    answer:
      "Your data is stored securely and is used only within this educational project. We do not share, sell, or transfer your information to third parties.",
  },
  {
    question: "Why am I not able to see available slots for some doctors?",
    answer:
      "Slots may appear unavailable if they are already booked by other users or if the doctor is marked unavailable in the system.",
  },
  {
    question: "Do I need to be logged in to book an appointment?",
    answer:
      "Yes, logging in is required to book appointments and manage your profile securely.",
  },
  {
    question: "How can I contact support?",
    answer:
      "You can reach out through the 'Help Center' page and submit your query or issue.",
  },
];


const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (


    <div className="pt-24">


      <div className="max-w-3xl mx-auto p-6 mt-10">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
          Frequently Asked Questions (FAQs)
        </h1>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border rounded-xl shadow-sm bg-white"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-4 text-left text-lg font-medium"
              >
                {faq.question}
                <span className="text-xl">{openIndex === index ? "−" : "+"}</span>
              </button>

              {openIndex === index && (
                <div className="px-4 pb-4 text-gray-700">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>


    </div>


  );
};

export default FaqPage;
