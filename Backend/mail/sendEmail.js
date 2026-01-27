import axios from "axios";

const sendEmail = async ({ to, subject, html }) => {
  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { name: "Medicare", email: "medicareapp01@gmail.com" },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error("Brevo API email error:", err.response?.data || err.message);
    throw err;
  }
};

export default sendEmail;
