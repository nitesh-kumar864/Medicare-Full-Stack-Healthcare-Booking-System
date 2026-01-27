export const INTENTS = [
  {
    name: "appointments",
    keywords: [
      "appointment",
      "book",
      "schedule",
      "cancel",
      "reschedule",
      "booking",
      "my appointment",
    ],
    response:
      "You can book or manage appointments from the Doctors page. Select a doctor, choose a time slot, and confirm."
  },

  {
    name: "payments",
    keywords: [
      "payment",
      "pay",
      "refund",
      "money",
      "price",
      "fee",
      "upi",
      "card",
      "net banking"
    ],
    response:
      "We support UPI, Cards, Net Banking and Wallet payments. Refunds are processed automatically if applicable."
  },

  {
    name: "doctors",
    keywords: [
      "doctor",
      "specialist",
      "availability",
      "available",
      "slot",
      "time"
    ],
    response:
      "You can view doctor profiles to check specialization and available time slots."
  },

  {
    name: "beds",
    keywords: [
      "bed",
      "book",
      "hospital",
      "admission",
      "ward",
      "icu",
      "booking"
    ],
    response:
      "Hospital beds can be booked from the Beds section by selecting an available bed."
  },

  {
    name: "profile",
    keywords: [
      "profile",
      "edit",
      "update",
      "photo",
      "picture",
      "image",
      "address",
      "phone",
      "mobile"
    ],
    response:
      "You can update your personal details from the My Profile page."
  },

  {
    name: "support",
    keywords: [
      "support",
      "help",
      "ticket",
      "issue",
      "problem",
      "complaint",
      "query"
    ],
    response:
      "You can contact support via the Help Center. Our team usually responds within 24 hours."
  },

  {
    name: "general",
    keywords: [
      "medicare",
      "about",
      "platform",
      "what is",
      "purpose",
      "use"
    ],
    response:
      "Medicare helps you book doctor appointments, manage hospital beds, make payments, and get support."
  }
];
