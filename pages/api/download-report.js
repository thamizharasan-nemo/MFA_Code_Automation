import { getAuthCookie } from "../../lib/session";

export default function handler(req, res) {
  const auth = getAuthCookie(req);
  if (!auth) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const report = `Login Report\nUser: ${auth.email}\nStatus: Success\nGenerated: ${new Date().toString()}\n`;
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Content-Disposition", "attachment; filename=login_report.txt");
  res.status(200).send(report);
}
