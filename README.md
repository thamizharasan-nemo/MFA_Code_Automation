# mfa-test-portal

A deployable Next.js stand-in login portal for the MFA automation prototype in `../MFA_Code_Automation/`. It replicates the same login → MFA-code-entry → dashboard flow as that project's `demo_login_app.py`, but as a real deployed site (e.g. on Vercel) instead of localhost — so the Python automation can be pointed at a real URL while the actual target portal's details are still unknown.

This project is fully separate from the Python project. It does not read or modify anything in `../MFA_Code_Automation/`.

## Active target: NSE MF Platform (nseinvest.com/nsemfamc/login.htm)

The active login page (`pages/index.js`) mirrors the real NSE MF Platform login page's field ids exactly (`#loginId`, `#password`, `#jcaptcha`, `button.btn-login-submit`), including a fake, fixed-answer captcha for structure/flow testing only — it is not a real captcha challenge. **Note:** the real NSE site has an actual captcha, which is a deliberate anti-automation control; solving it programmatically on the real site is a materially different and more sensitive thing than filling a normal form, worth resolving with your team (a sanctioned API route, an IP-whitelist arrangement, or a human completing that one step) before pointing automation at the real URL.

## Disabled: BSE StAR MF login (bsestarmf.in/index.aspx)

The previous BSE-style login page still exists, fully intact, at `disabled-pages/bse-login.js` — moved out of `pages/` so Next.js doesn't route it (Next.js's file-based routing means anything inside `pages/` becomes a live route regardless of comments, so relocating the file is the equivalent of "commenting it out"). To reactivate it later: move it back to `pages/index.js` (and move the current NSE `pages/index.js` out first). It still expects `DEMO_MEMBER_ID`, `MEMBER_ID_SELECTOR`, `MEMBER_ID` (in the Python `.env`, currently commented out with a `# BSE (disabled):` prefix — search for that string to find everything to restore).

## Flow

1. `/` — login page (NSE-style). Submits to `/api/login`.
2. `/api/login` — checks the fake captcha, then credentials against `DEMO_USERNAME`/`DEMO_USER_PASSWORD`, generates a 6-digit code, emails it via Gmail SMTP to `MFA_TARGET_EMAIL` (subject: `Your login verification code` — must stay exact, it's what the existing Outlook forwarding Rule matches on), and sets a signed, httpOnly "pending" cookie holding the code and its 5-minute expiry.
3. `/verify` — code entry page. Submits to `/api/verify`.
4. `/api/verify` — checks the submitted code against the pending cookie. On success, clears it and sets a signed "authenticated" cookie.
5. `/home` — dashboard. Auto-clicks a link to `/api/download-report`, which streams a text report if the authenticated cookie is present.

All three pages (`/`, `/verify`, `/home`) share a consistent styled look (top bar, centered card, indigo accent color) for presenting the flow to others, not just the login page.

Session state lives entirely in signed, httpOnly cookies (HMAC-signed with `SESSION_SECRET`) rather than server memory, since Vercel's serverless functions don't share memory between invocations.

## Selectors (for the Python automation's env vars)

| Element | Attribute |
|---|---|
| Login ID input | `#loginId` (matches the real nseinvest.com field id exactly, maxlength 20) |
| Password input | `#password` (matches the real nseinvest.com field id exactly, maxlength 15) |
| Captcha input | `#jcaptcha` (matches the real nseinvest.com field id exactly) |
| Log-in button | `button.btn-login-submit` (matches the real nseinvest.com field class exactly — the real page has no id on this button) |
| MFA code input | `[data-test="mfa-code"]` |
| MFA submit button | `[data-test="mfa-submit"]` |
| Dashboard heading | `[data-test="home-welcome"]` |
| Download link | `[data-test="download-report-link"]` |

The login page's field ids/classes intentionally match the real NSE MF Platform login page exactly, so selector config developed against this clone is directly reusable against the real site later — only `TARGET_LOGIN_URL` needs to change then. The MFA/verify/dashboard pages still use the original `data-test` convention since the real post-login pages are unknown.

The Python automation's `.env` is already pointed at this clone:
```
TARGET_LOGIN_URL=http://localhost:3000
USERNAME_SELECTOR=#loginId
PASSWORD_SELECTOR=#password
SUBMIT_SELECTOR=button.btn-login-submit
CAPTCHA_SELECTOR=#jcaptcha
CAPTCHA_VALUE=TEST12
```
`CAPTCHA_SELECTOR`/`CAPTCHA_VALUE` are opt-in (only filled if `CAPTCHA_SELECTOR` is set), same pattern as the earlier `MEMBER_ID_SELECTOR`.

## Environment variables

Copy `.env.local.example` to `.env.local` for local development and fill in real values (reuse the same values already in `../MFA_Code_Automation/MFA_Code_Automation/.env`):

- `DEMO_USERNAME` / `DEMO_USER_PASSWORD` — valid login credentials
- `DEMO_CAPTCHA_TEXT` / `NEXT_PUBLIC_DEMO_CAPTCHA_TEXT` — the fake captcha's fixed answer, must match (server-side and client-displayed copies)
- `GMAIL_SENDER_ADDRESS` / `GMAIL_APP_PASSWORD` — Gmail SMTP sender that triggers the MFA email
- `MFA_TARGET_EMAIL` — the Outlook account with the forwarding Rule on it
- `SESSION_SECRET` — any random long string, used to sign session cookies
- `DEMO_MEMBER_ID` — only used by the disabled BSE clone, not the active NSE one

For Vercel deployment, add the same variables under Project Settings → Environment Variables. `.env.local` is never read in production — Vercel only uses its own dashboard-configured env vars.

## Run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Deploy to Vercel

1. Push this folder to its own git repository (or use the Vercel CLI directly from this folder).
2. In Vercel, import the project, set the Root Directory to this folder if the repo contains other projects.
3. Add the environment variables listed above under Project Settings → Environment Variables.
4. Deploy. Vercel gives you a public URL like `https://your-project.vercel.app`.
5. In the Python automation's `.env`, set `TARGET_LOGIN_URL=https://your-project.vercel.app` — no other changes needed since selectors and the `/home` route already match.

## What's out of scope here

- The real target portal's actual URL/selectors — unknown for post-login pages, not part of this project.
- Any change to the Python automation project beyond `.env` selector values.
- Solving the real NSE site's actual captcha — the fake one here is for structure/flow testing only.
# MFA_Code_Automation
