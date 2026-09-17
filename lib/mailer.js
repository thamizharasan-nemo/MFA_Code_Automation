import nodemailer from "nodemailer";

// Subject must exactly match the existing Outlook forwarding Rule's condition
// ("Subject includes: Your login verification code") and the existing
// automation's MFA_SUBJECT_CONTAINS default -- do not change this string.
const MFA_SUBJECT = "Your login verification code";

export async function sendMfaCode(code) {
  const sender = process.env.GMAIL_SENDER_ADDRESS;
  const appPassword = (process.env.GMAIL_APP_PASSWORD || "").replace(/\s+/g, "");
  const targetEmail = process.env.MFA_TARGET_EMAIL;

  if (!sender || !appPassword || !targetEmail) {
    throw new Error("GMAIL_SENDER_ADDRESS, GMAIL_APP_PASSWORD, and MFA_TARGET_EMAIL must be configured");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: { user: sender, pass: appPassword },
  });

  await transporter.sendMail({
    from: sender,
    to: targetEmail,
    subject: MFA_SUBJECT,
    text: `Your one-time login code is ${code}. It expires in 5 minutes.`,
  });
}
