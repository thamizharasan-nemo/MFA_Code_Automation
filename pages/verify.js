import { useState } from "react";
import { useRouter } from "next/router";
import { getPendingCookie } from "../lib/session";

export async function getServerSideProps({ req }) {
  const pending = getPendingCookie(req);
  if (!pending) {
    return { redirect: { destination: "/", permanent: false } };
  }
  return { props: { email: pending.email } };
}

export default function VerifyPage({ email }) {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(e.target);

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: form.get("code") }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setSubmitting(false);
      } else {
        router.push("/home");
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
          <div className="brand">Verify Your Identity</div>
          <p className="subtext">We emailed a code to {email}</p>

          {error && (
            <p className="error" data-test="verify-error">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <label htmlFor="code">Verification Code</label>
            <input id="code" name="code" type="text" data-test="mfa-code" placeholder="6-digit code" />

            <button type="submit" className="btnPrimary" data-test="mfa-submit" disabled={submitting}>
              Verify
            </button>
          </form>
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
          margin-bottom: 6px;
        }
        .subtext {
          text-align: center;
          font-size: 13px;
          color: #666;
          margin-bottom: 16px;
        }
        label {
          display: block;
          font-size: 13px;
          color: #555;
          margin-top: 14px;
          margin-bottom: 4px;
        }
        input[type="text"] {
          width: 100%;
          padding: 8px 10px;
          border: 1px solid #c9ced6;
          border-radius: 4px;
          font-size: 14px;
          box-sizing: border-box;
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
