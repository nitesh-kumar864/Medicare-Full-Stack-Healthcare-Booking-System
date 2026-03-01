export const DoctorNewAppointmentTemplate = (appointment) => {
  return `
  <div style="max-width: 600px; margin: 20px auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #ffffff; padding: 30px; border-radius: 10px; border: 1px solid #eaeaea; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">

      <div style="background-color: #29ec91; padding: 20px; text-align: center; margin-bottom: 10px;">
    <img src="https://res.cloudinary.com/dozq9qzhh/image/upload/v1769458899/logo_wkn1e5.png" alt="Medicare Logo"
      style="height: 50px; margin-bottom: 6px;" />
  </div>

    <div style="padding: 20px; text-align: center;">
      <h2 style="color: #1665d5; margin: 0;">New Appointment Booked</h2>
    </div>

    <p style="margin-top: 20px; font-size: 16px;">
      Hello <strong>${appointment.doctorData.name}</strong>,
    </p>

    <p style="color: #374151;">
      A new patient has booked an appointment. Here are the details:
    </p>

    <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
      
      <p><strong>Patient Name:</strong> ${appointment.userData.name}</p>
      <p><strong>Patient Email:</strong> ${appointment.userData.email}</p>
      <p><strong>Date:</strong> ${appointment.slotDate}</p>
      <p><strong>Time:</strong> ${appointment.slotTime}</p>
      <p><strong>Amount Paid:</strong> ₹${appointment.amount}</p>
      <p><strong>Payment Method:</strong> ${appointment.paymentMethod}</p>
      
    </div>

    <p style="color: #4b5563;">
      Please log in to your dashboard to manage this appointment.
    </p>

    <p style="margin-top: 30px;">
      Regards,<br/>
      Medicare System
    </p>

    <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
    <p style="font-size: 12px; color: #6b7280; margin: 0;">
      © ${new Date().getFullYear()} Medicare. All rights reserved.
    </p>
  </div>

  </div>
  `;
};