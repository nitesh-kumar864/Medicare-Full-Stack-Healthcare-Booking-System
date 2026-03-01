export const AppointmentCompletedTemplate = (appointment) => {
  return `
    <style>
      /* Mobile Responsive Styles */
      @media only screen and (max-width: 600px) {
        .email-container {
          padding: 20px 15px !important;
          margin: 10px !important;
          width: auto !important;
        }
        .detail-row {
          display: block !important;
          margin-bottom: 15px !important;
        }
        .detail-label {
          display: block !important;
          width: 100% !important;
          margin-bottom: 4px !important;
          color: #64748b !important;
        }
        .header-title {
          font-size: 20px !important;
        }
      }
    </style>

    <div class="email-container" style="max-width: 600px; margin: 20px auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #ffffff; padding: 30px; border-radius: 10px; border: 1px solid #eaeaea; box-shadow: 0 4px 10px rgba(0,0,0,0.05); box-sizing: border-box;">

    
  <div style="background-color: #29ec91; padding: 20px; text-align: center; margin-bottom: 10px;">
    <img src="https://res.cloudinary.com/dozq9qzhh/image/upload/v1769458899/logo_wkn1e5.png" alt="Medicare Logo"
      style="height: 50px; margin-bottom: 6px;" />
  </div>
      
      <h2 class="header-title" style="color: #16a34a; text-align: center; margin-top: 20px; padding-bottom: 15px; border-bottom: 1px solid #f0f0f0;">
        Appointment Confirmed
      </h2>
      
      <div style="color: #374151; font-size: 16px; line-height: 1.6;">
        <p>Hello  <span style="font-weight: 600; font-size: 18px; color: #111827;">${appointment.userData.name}</span>,</p>
        <p>Your appointment has been successfully confirmed. Below are your booking details:</p>
      </div>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 25px 0;">
        <p class="detail-row" style="margin: 10px 0; color: #1e293b; font-size: 15px;">
          <strong class="detail-label" style="color: #475569; display: inline-block; width: 140px;">Doctor:</strong> ${appointment.doctorData.name}
        </p>
        <p class="detail-row" style="margin: 10px 0; color: #1e293b; font-size: 15px;">
          <strong class="detail-label" style="color: #475569; display: inline-block; width: 140px;">Date:</strong> ${appointment.slotDate}
        </p>
        <p class="detail-row" style="margin: 10px 0; color: #1e293b; font-size: 15px;">
          <strong class="detail-label" style="color: #475569; display: inline-block; width: 140px;">Time:</strong> ${appointment.slotTime}
        </p>
        <p class="detail-row" style="margin: 10px 0; color: #1e293b; font-size: 15px;">
          <strong class="detail-label" style="color: #475569; display: inline-block; width: 140px;">Amount:</strong> ₹${appointment.amount}
        </p>
        <p class="detail-row" style="margin: 10px 0; color: #1e293b; font-size: 15px;">
          <strong class="detail-label" style="color: #475569; display: inline-block; width: 140px;">Payment Method:</strong> ${appointment.paymentMethod}
        </p>
      </div>

      <p style="color: #4b5563; font-size: 15px; text-align: center; margin-top: 30px;">
        <span style="font-size: 13px;"><span style="font-weight: 700;">Notes: </span>Please arrive 10 minutes before your scheduled time.</span>
      </p>
<p style="color: #4b5563; font-size: 15px; text-align: left; margin-top: 30px; line-height: 1.5;">

    <strong style="color: #111827;">Regards,</strong><br>
    Medicare Team
  </p>

  <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
    <p style="font-size: 12px; color: #6b7280; margin: 0;">
      © ${new Date().getFullYear()} Medicare. All rights reserved.
    </p>
    <p style="font-size: 12px; color: #9ca3af; margin-top: 5px;">
      Need help? Contact us at
      <a href="${process.env.CLIENT_URL}/help-center" style="color: #3b11ad; text-decoration: none;">
        Help-Center
      </a>
    </p>
  </div>

</div>
  `;
};