export const resetPasswordSuccessTemplate = ({ name }) => {
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

                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="display: inline-block; padding: 12px; background-color: #dcfce7; border-radius: 50%;">
                        <span style="font-size: 30px; color: #16a34a;">&#10003;</span>
                    </div>
                </div>

                <h2 style="color: #1f2937; text-align: center; margin-bottom: 20px;">
                    Password Successfully Updated
                </h2>

                <p style="font-size: 16px;">
                    Dear <strong>${name}</strong>,
                </p>

                <p style="font-size: 16px; color: #4b5563;">
                    This email is to confirm that the password associated with your Medicare account has been
                    successfully changed.
                </p>

                <p style="font-size: 16px; color: #4b5563;">
                    You may now sign in using your new password.
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
                    <a href="${process.env.CLIENT_URL}/help-center" style="color: #16a34a; text-decoration: none;">
                        Help-Center
                    </a>
                </p>
            </div>

        </div>
    </div>
    </div>
  `;
};
