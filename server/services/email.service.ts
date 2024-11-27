import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'marjolaine.nolan79@ethereal.email',
        pass: 'KKvrtecga5BMUC32t8'
    }
});

const sendEmail = async (to: string, subject: string, text: string) => {
    const message = { from : 'dummy@gmail.com', to, subject, text};
    await transport.sendMail(message);
}

const sendResetPasswordEmail = async (to: string, token: string) => {
  const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

const sendEmailVerification = async  (to: string, token: string) => {
    const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `http://localhost:8080/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
}

export { sendEmail, sendEmailVerification, sendResetPasswordEmail }