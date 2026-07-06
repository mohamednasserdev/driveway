const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * بيبعت OTP على الإيميل
 */
const sendOTPEmail = async (email, name, otp) => {
  await resend.emails.send({
    from: 'DriveWay <onboarding@resend.dev>',
    to: email,
    subject: 'Your DriveWay Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0f172a; padding: 30px; text-align: center;">
          <h1 style="color: #3b82f6; margin: 0;">DriveWay</h1>
          <p style="color: #94a3b8; margin: 5px 0 0;">Car Rental Booking System</p>
        </div>

        <div style="background: #f8fafc; padding: 40px 30px; text-align: center;">
          <h2 style="color: #1e293b;">Hi ${name}! 👋</h2>
          <p style="color: #64748b;">Your verification code is:</p>

          <div style="background: #1e293b; border-radius: 12px; padding: 24px; margin: 24px auto; width: fit-content;">
            <h1 style="color: #3b82f6; font-size: 48px; letter-spacing: 12px; margin: 0;">
              ${otp}
            </h1>
          </div>

          <p style="color: #94a3b8; font-size: 13px;">
            This code expires in <strong>10 minutes</strong>.<br/>
            If you didn't create an account, ignore this email.
          </p>
        </div>

        <div style="background: #0f172a; padding: 20px; text-align: center;">
          <p style="color: #64748b; font-size: 12px; margin: 0;">
            © 2026 DriveWay Car Rentals
          </p>
        </div>
      </div>
    `,
  });
};

module.exports = { sendOTPEmail };