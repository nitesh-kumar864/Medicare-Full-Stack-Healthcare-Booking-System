export const resetPasswordTemplate = ({ name, resetURL }) => {
    return `
   <div
        style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f5; padding: 20px;">
        <div
            style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">

            <div style="background-color: #29ec91; padding: 20px; text-align: center;">
                <img src="https://res.cloudinary.com/dozq9qzhh/image/upload/v1769458899/logo_wkn1e5.png"
                    alt="Medicare Logo" style="height: 50px; margin-bottom: 6px;" />
            </div>


            <div style="padding: 30px;">

                <h2 style="color: #1f2937; text-align: center; margin-bottom: 20px;">
                    Password Reset Request
                </h2>

                <p style="font-size: 16px;">
                    Dear <strong>${name}</strong>,
                </p>

                <p style="font-size: 16px; color: #4b5563;">
                    We received a request to reset the password associated with your Medicare account.
                    To proceed, please click the button below and follow the instructions to create a new password.
                </p>

                <div style="text-align: center; margin: 35px 0;">
                    <a href="${resetURL}"
                        style="background-color: #3543ff; color: #ffffff; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px;">
                        Reset Password
                    </a>
                </div>

                <p style="margin: 0; font-size: 13px; color: #cf366c;">
                    This password reset link will expire in <strong>15 minutes</strong>.
                </p>
                <p style="margin-top:20px; font-size:15px;">
                    Regards,<br />
                    <strong>Medicare Team</strong>
                </p>
            </div>
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
    </div>
  `;
};
