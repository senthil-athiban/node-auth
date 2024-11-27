import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "marjolaine.nolan79@ethereal.email",
    pass: "KKvrtecga5BMUC32t8",
  },
});

const sendEmail = async (to: string, subject: string, text: string) => {
  const message = { from: "dummy@gmail.com", to, subject, text };
  await transport.sendMail(message);
};

const sendOTPEmail = async (to: string, token: string) => {
  const subject = "Two factor authentication";
  const verificationUrl = `${process.env.DOMAIN}/verify-otp?token=${token}`;
  const text = `Dear user,
To verify your account, click on this link: ${verificationUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

const sendResetPasswordEmail = async (to: string, token: string) => {
  const subject = "Reset password";
  const resetPasswordUrl = `${process.env.DOMAIN}/reset-password?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

const sendEmailVerification = async (to: string, token: string) => {
  const subject = "Email Verification";
  const verificationEmailUrl = `http://localhost:8080/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

export { sendEmail, sendEmailVerification, sendResetPasswordEmail, sendOTPEmail };
