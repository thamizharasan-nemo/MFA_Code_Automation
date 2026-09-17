import { checkCredentials, checkCaptcha } from "../../lib/credentials";
import { sendMfaCode } from "../../lib/mailer";
import { setPendingCookie } from "../../lib/session";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { userId, password, captcha } = req.body || {};

  if (!checkCaptcha(captcha)) {
    res.status(200).json({ error: "Invalid Captcha" });
    return;
  }

  if (!checkCredentials(userId, password)) {
    res.status(200).json({ error: "Invalid Login ID or Password" });
    return;
  }

  const code = String(Math.floor(Math.random() * 1000000)).padStart(6, "0");
  const expiresAt = Date.now() + 5 * 60 * 1000;

  try {
    await sendMfaCode(code);
  } catch (err) {
    console.error("Failed to send MFA code:", err.message);
    res.status(200).json({ error: "Failed to send MFA code, please try again" });
    return;
  }

  setPendingCookie(res, { email: userId, code, expiresAt });
  res.status(200).json({ ok: true });
}
