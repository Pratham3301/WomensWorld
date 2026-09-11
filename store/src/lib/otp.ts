import prisma from './prisma';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;


export async function generateOTP(identifier: string, type: string = 'email_verification') {
  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // ALWAYS log the OTP for local development testing, because Resend sandbox suppresses emails to unauthorized addresses silently.
  console.log(`\n========================================`);
  console.log(`[DEVELOPMENT OTP] To: ${identifier} | Code: ${otp}`);
  console.log(`========================================\n`);

  // Set expiration to 10 minutes from now
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  // Save or update OTP in the database
  await prisma.oTPVerification.create({
    data: {
      identifier,
      otp,
      type,
      expiresAt,
    },
  });

  // Is it an email or a phone number?
  const isEmail = identifier.includes('@');

  if (isEmail) {
    if (resend) {
      try {
        await resend.emails.send({
          from: 'Womens World <onboarding@resend.dev>', // Use onboarding@resend.dev for testing unless domain is verified
          to: identifier,
          subject: 'Your Verification Code - Women\'s World',
          html: `
            <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-w: 600px; margin: 0 auto; background-color: #FDFBF7; border: 1px solid #E8DCC4; border-radius: 12px; overflow: hidden;">
              <div style="background-color: #121212; padding: 30px 20px; text-align: center;">
                <h1 style="color: #C5A46D; margin: 0; font-family: serif; font-size: 28px; letter-spacing: 2px; text-transform: uppercase;">Women's World</h1>
              </div>
              
              <div style="padding: 40px 30px; text-align: center;">
                <h2 style="color: #121212; margin-top: 0; font-size: 22px;">Verification Code 🔐</h2>
                <p style="color: #4A3B32; font-size: 15px; line-height: 1.6; margin-bottom: 30px;">Please use the following 6-digit code to securely verify your email address. This code will expire in 10 minutes.</p>
                
                <div style="background-color: white; padding: 25px; border-radius: 12px; margin: 25px auto; border: 2px dashed #C5A46D; max-w: 300px;">
                  <h3 style="margin: 0; color: #121212; font-size: 36px; letter-spacing: 8px;">${otp}</h3>
                </div>

                <p style="color: #8B7355; font-size: 13px; margin-top: 30px;">If you didn't request this code, you can safely ignore this email.</p>
              </div>

              <div style="background-color: #121212; padding: 20px; text-align: center; color: #6E6A64; font-size: 12px;">
                <p style="margin: 0;">&copy; ${new Date().getFullYear()} Women's World. All rights reserved.</p>
              </div>
            </div>
          `,
        });
        console.log(`[DEV LOG] Sent OTP via Resend to ${identifier}: ${otp}`);
      } catch (error) {
        console.error('Failed to send Resend email:', error);
        console.log(`[FALLBACK] Simulated OTP for ${identifier}: ${otp}`);
      }
    } else {
      console.log(`[SIMULATED EMAIL OTP SENT] To: ${identifier} | Code: ${otp}`);
    }
  } else {
    // It's a phone number
    if (process.env.FAST2SMS_API_KEY) {
      // Uncle paid for SMS! Send OTP to their phone (Placeholder for future)
      // await sendSmsOtp(identifier, otp); 
      console.log(`[FAST2SMS PLACEHOLDER] To: ${identifier} | Code: ${otp}`);
    } else {
      // No SMS key yet, simulate or block?
      console.log(`[SIMULATED SMS OTP SENT] To: ${identifier} | Code: ${otp}`);
    }
  }

  return otp;
}

export async function verifyOTP(identifier: string, otp: string, type: string = 'email_verification') {
  // Find the most recent OTP for this identifier and type
  const record = await prisma.oTPVerification.findFirst({
    where: {
      identifier,
      otp,
      type,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!record) {
    return { isValid: false, error: 'Invalid OTP code.' };
  }

  if (new Date() > record.expiresAt) {
    return { isValid: false, error: 'This OTP has expired.' };
  }

  // Delete the used OTP to prevent reuse
  await prisma.oTPVerification.deleteMany({
    where: { identifier, type },
  });

  return { isValid: true };
}
