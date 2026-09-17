import crypto from "crypto";
import { stringifySetCookie, parseCookie } from "cookie";

const SECRET = process.env.SESSION_SECRET || "dev-secret-not-for-production";
const PENDING_COOKIE = "mfa_pending";
const AUTH_COOKIE = "mfa_authenticated";
const PENDING_MAX_AGE_SECONDS = 300; // matches CODE_TTL_SECONDS in demo_login_app.py
const AUTH_MAX_AGE_SECONDS = 3600;

function sign(payload) {
  const base64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const hmac = crypto.createHmac("sha256", SECRET).update(base64).digest("base64url");
  return `${base64}.${hmac}`;
}

function unsign(value) {
  if (!value) return null;
  const [base64, hmac] = value.split(".");
  if (!base64 || !hmac) return null;
  const expected = crypto.createHmac("sha256", SECRET).update(base64).digest("base64url");
  if (expected !== hmac) return null;
  try {
    return JSON.parse(Buffer.from(base64, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

function appendCookie(res, cookieString) {
  const existing = res.getHeader("Set-Cookie");
  const cookies = existing ? (Array.isArray(existing) ? existing : [existing]) : [];
  cookies.push(cookieString);
  res.setHeader("Set-Cookie", cookies);
}

function setCookie(res, name, value, maxAgeSeconds) {
  appendCookie(
    res,
    stringifySetCookie({
      name,
      value,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: maxAgeSeconds,
      secure: process.env.NODE_ENV === "production",
    })
  );
}

function clearCookie(res, name) {
  appendCookie(
    res,
    stringifySetCookie({
      name,
      value: "",
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
      secure: process.env.NODE_ENV === "production",
    })
  );
}

function readCookie(req, name) {
  const cookies = parseCookie(req.headers.cookie || "");
  return cookies[name];
}

export function setPendingCookie(res, payload) {
  setCookie(res, PENDING_COOKIE, sign(payload), PENDING_MAX_AGE_SECONDS);
}

export function getPendingCookie(req) {
  return unsign(readCookie(req, PENDING_COOKIE));
}

export function clearPendingCookie(res) {
  clearCookie(res, PENDING_COOKIE);
}

export function setAuthCookie(res, payload) {
  setCookie(res, AUTH_COOKIE, sign(payload), AUTH_MAX_AGE_SECONDS);
}

export function getAuthCookie(req) {
  return unsign(readCookie(req, AUTH_COOKIE));
}

export function clearAuthCookie(res) {
  clearCookie(res, AUTH_COOKIE);
}
