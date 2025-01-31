import nodemailer from 'nodemailer';
import { generate } from 'otp-generator';

export const sendOTP = async (email) => {

  const otp = generate(6,
    { 
      digits: true,
      alphabets: false,
      upperCase: false,
      specialChars: false
    });

    // Set up nodemailer transporter
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.E_PASSWORD
        }
    });

    let mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'OTP for Note Access',
        text: `Your OTP for accessing the confidential note is: ${otp}`
    };

    let info = await transporter.sendMail(mailOptions);
    
    return otp;
};

export const verifyOTP = (submittedOTP, storedOTP, expirationTime) => {
  const currentTimestamp = Date.now();

  if (currentTimestamp <= expirationTime) {
      return submittedOTP === storedOTP;
  }

  return false;
};