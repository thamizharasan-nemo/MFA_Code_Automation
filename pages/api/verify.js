import { getPendingCookie, clearPendingCookie, setAuthCookie } from "../../lib/session";

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { code } = req.body || {};
  const pending = getPendingCookie(req);

  if (!pending) {
    res.status(200).json({ error: "Session expired, please sign in again" });
    return;
  }

  if (Date.now() > pending.expiresAt) {
    clearPendingCookie(res);
    res.status(200).json({ error: "Code expired, please sign in again" });
    return;
  }

  if (!code || code !== pending.code) {
    res.status(200).json({ error: "Incorrect code" });
    return;
  }

  clearPendingCookie(res);
  setAuthCookie(res, { email: pending.email });
  res.status(200).json({ ok: true });
}
