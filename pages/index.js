import { useState } from "react";
import { useRouter } from "next/router";

// Field ids below (loginId, password, jcaptcha, button.btn-login-submit) match
// the real NSE MF Platform login page (nseinvest.com/nsemfamc/login.htm)
// exactly, so selector config developed against this clone carries over
// directly to the real site later -- only TARGET_LOGIN_URL needs to change.
// The captcha here is a fake, fixed-answer stand-in (see DEMO_CAPTCHA_TEXT)
// for structure/flow testing only -- it is not a real captcha challenge.
// Styling is loosely inspired by the real page's layout, not a pixel copy.

const FAKE_CAPTCHA_TEXT = process.env.NEXT_PUBLIC_DEMO_CAPTCHA_TEXT || "TEST12";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [captchaKey, setCaptchaKey] = useState(0);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(e.target);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: form.get("loginId"),
          password: form.get("password"),
          captcha: form.get("jcaptcha"),
        }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setSubmitting(false);
        setCaptchaKey((k) => k + 1);
      } else {
        router.push("/verify");
      }
    } catch (err) {
      setError("Something went wrong, please try again");
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <div className="topbar">
        <span className="topbarBrand">NSE MF Platform</span>
        <span className="topbarDesk">Desk &middot; Test Portal</span>
        <span className="topbarVersion">v0.1 (test)</span>
      </div>

      <div className="hero">
        <div className="card">
          <div className="brand">NSE | Mutual Fund Platform</div>

          {error && (
            <p className="error" data-test="login-error">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <label htmlFor="loginId">Login ID</label>
            <input
              id="loginId"
              name="loginId"
              type="text"
              maxLength={20}
              data-test="login-username"
              placeholder="Login ID"
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              maxLength={15}
              data-test="login-password"
              placeholder="Password"
            />

            <label htmlFor="jcaptcha">Enter Captcha</label>
            <div className="captchaRow">
              <input
                id="jcaptcha"
                name="jcaptcha"
                type="text"
                autoComplete="off"
                data-test="login-captcha"
                placeholder="Enter Captcha"
              />
              <div className="captchaBox" key={captchaKey}>
                {FAKE_CAPTCHA_TEXT}
              </div>
            </div>
            <a
              className="reload"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCaptchaKey((k) => k + 1);
              }}
            >
              Reload
            </a>

            <button
              type="submit"
              className="btn-login-submit btnPrimary"
              data-test="login-submit"
              disabled={submitting}
            >
              Log in
            </button>
          </form>

          <a className="forgot" href="#" onClick={(e) => e.preventDefault()}>
            Forgot Password?
          </a>
        </div>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          font-family: Arial, Helvetica, sans-serif;
        }
        .topbar {
          background: #fff;
          border-bottom: 1px solid #e2e5ea;
          padding: 12px 24px;
          display: flex;
          align-items: baseline;
          gap: 12px;
        }
        .topbarBrand {
          font-weight: 700;
          color: #3d2a8c;
          font-size: 18px;
        }
        .topbarDesk {
          color: #555;
          font-size: 13px;
        }
        .topbarVersion {
          margin-left: auto;
          color: #888;
          font-size: 12px;
        }
        .hero {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg, #cfd9e8 0%, #9fb0c9 100%);
          padding: 40px 16px;
        }
        .card {
          background: #ffffff;
          border-radius: 6px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          padding: 32px 36px;
          width: 340px;
        }
        .brand {
          text-align: center;
          font-weight: 700;
          color: #3d2a8c;
          font-size: 16px;
          margin-bottom: 20px;
        }
        label {
          display: block;
          font-size: 13px;
          color: #555;
          margin-top: 14px;
          margin-bottom: 4px;
        }
        input[type="text"],
        input[type="password"] {
          width: 100%;
          padding: 8px 10px;
          border: 1px solid #c9ced6;
          border-radius: 4px;
          font-size: 14px;
          box-sizing: border-box;
        }
        .captchaRow {
          display: flex;
          gap: 8px;
          align-items: stretch;
        }
        .captchaRow input {
          flex: 1;
        }
        .captchaBox {
          background: #eceff3;
          border: 1px solid #c9ced6;
          border-radius: 4px;
          padding: 8px 14px;
          font-style: italic;
          font-weight: 700;
          letter-spacing: 3px;
          color: #444;
          transform: skewX(-6deg);
          white-space: nowrap;
        }
        .reload {
          display: block;
          text-align: right;
          font-size: 12px;
          color: #3d2a8c;
          margin-top: 4px;
          text-decoration: none;
        }
        .btnPrimary {
          width: 100%;
          margin-top: 20px;
          padding: 10px;
          background: #3d2a8c;
          color: #fff;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
        }
        .btnPrimary:disabled {
          opacity: 0.6;
          cursor: default;
        }
        .forgot {
          display: block;
          text-align: center;
          margin-top: 14px;
          font-size: 13px;
          color: #3d2a8c;
          text-decoration: none;
        }
        .error {
          color: #b3261e;
          font-size: 13px;
          margin-bottom: 8px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
