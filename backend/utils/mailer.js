import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendVerificationEmail = async (to, url) => {
  await transporter.sendMail({
    from: `"Heritage App" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Verify Your Email',
    html: `<h2>Email Verification</h2><p>Click the link below to verify your email:</p><a href="${url}">${url}</a>`
  });
};

export const sendPasswordResetEmail = async (to, url) => {
  await transporter.sendMail({
    from: `"Heritage App" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Reset Your Password',
    html: `<h2>Password Reset</h2>
           <p>Click the link below to reset your password (valid for 1 hour):</p>
           <a href="${url}">${url}</a>`
  });
};
