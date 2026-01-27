export const signupOtpTemplate = ({ userName, verificationCode }) => {
  return `
 <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333333;
              background-color: #f4f4f5;
              padding: 20px;">

        <div style="max-width: 500px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0,0,0,0.08);">

            <!-- HEADER -->

            <div style="background-color: #29ec91; padding: 20px; text-align: center;">
                <img src="https://res.cloudinary.com/dozq9qzhh/image/upload/v1769458899/logo_wkn1e5.png"
                    alt="Medicare Logo" style="height: 50px; margin-bottom: 6px;" />
            </div>


            <div style="padding: 30px;">
                <h2 style="color: #1f2937; text-align: center; margin-bottom: 20px;">
                    Verify Your Email
                </h2>

                <!-- BODY -->
                <div style="padding: 30px;">

                    <p style="font-size: 16px;">
                        Hello <strong>${userName}</strong>,
                    </p>

                    <p style="font-size: 15px; color: #4b5563;">
                        Thanks for signing up! Your email verification code is:
                    </p>

                    <!-- OTP -->
                    <div style="text-align: center; margin: 30px 0;">
                        <div style="
                        display: inline-block;
                        font-size: 34px;
                        font-weight: bold;
                        padding: 14px 24px;
                        color: #1821d3;
                        border: 2px dashed #3b0fcb;
                        border-radius: 8px;
                        letter-spacing: 3px;
          ">
                            ${verificationCode}
                        </div>
                    </div>

                    <p style="font-size: 15px; color: #4b5563;">
                        Enter this code on the verification page to complete your registration.
                    </p>

                    <p style="font-size: 15px; color: #4b5563;">
                        This code is valid for <strong>15 minutes</strong>.
                    </p>

                    <p style="font-size: 15px; color: #6b7280;">
                        If you did not request this, you can safely ignore this email.
                    </p>

                    <p style="margin-top: 20px; font-size: 15px;">
                        Regards,<br />
                        <strong>Medicare Team</strong>
                    </p>

                </div>

                <!-- FOOTER -->
                <div style="background-color: #f9fafb;
                  padding: 20px;
                  text-align: center;
                  border-top: 1px solid #e5e7eb;">
                    <p style="font-size: 12px; color: #6b7280; margin: 0;">
                        © ${new Date().getFullYear()} Medicare. All rights reserved.
                    </p>

                    <p style="font-size: 12px; color: #9ca3af; margin-top: 5px;">
                        Need help? Contact us at
                        <a href="${process.env.CLIENT_URL}/help-center" style="color: #3e08a4; text-decoration: none;">
                            Help Center
                        </a>
                    </p>
                </div>

            </div>
        </div>
  `;
};