import { useState } from "react";
import { useRouter } from "next/router";

// Field ids/names below (txtUserId, txtMemberId, txtPassword, btnLogin, btnReset)
// match the real BSE StAR MF login page (bsestarmf.in/index.aspx) exactly, so
// selector config developed against this clone carries over directly to the
// real site later -- only TARGET_LOGIN_URL needs to change.
// Styling here is loosely inspired by the real page's layout (card, labeled
// fields, login/reset buttons) but is not a pixel-for-pixel brand copy.

export default function LoginPage() {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
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
          userId: form.get("txtUserId"),
          memberId: form.get("txtMemberId"),
          password: form.get("txtPassword"),
        }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setSubmitting(false);
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
      <div className="card">
        <div className="brand">
          <span className="brandName">StAR MF</span>
          <span className="brandTagline">Test Portal</span>
        </div>

        <h1>Login Here</h1>

        {error && (
          <p className="error" data-test="login-error">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="txtUserId">Username</label>
          <input id="txtUserId" name="txtUserId" type="text" maxLength={20} data-test="login-username" />

          <label htmlFor="txtMemberId">Member ID</label>
          <input id="txtMemberId" name="txtMemberId" type="text" maxLength={20} data-test="login-memberid" />

          <label htmlFor="txtPassword">Password</label>
          <input id="txtPassword" name="txtPassword" type="password" maxLength={20} data-test="login-password" />

          <div className="buttonRow">
            <input
              type="submit"
              id="btnLogin"
              value="Log-in"
              data-test="login-submit"
              disabled={submitting}
              className="btnPrimary"
            />
            <input type="reset" id="btnReset" value="Reset" data-test="login-reset" className="btnSecondary" />
          </div>
        </form>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eef1f5;
          font-family: Arial, Helvetica, sans-serif;
        }
        .card {
          background: #ffffff;
          border: 1px solid #d7dce2;
          border-radius: 4px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
          padding: 32px 40px;
          width: 320px;
        }
        .brand {
          display: flex;
          flex-direction: column;
          margin-bottom: 16px;
        }
        .brandName {
          font-size: 22px;
          font-weight: 700;
          color: #0b3d91;
        }
        .brandTagline {
          font-size: 12px;
          color: #d9722c;
          font-weight: 600;
          letter-spacing: 1px;
        }
        h1 {
          font-size: 16px;
          color: #4a4a4a;
          font-weight: 600;
          margin-bottom: 16px;
        }
        label {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: #333;
          margin-top: 12px;
          margin-bottom: 4px;
        }
        input[type="text"],
        input[type="password"] {
          width: 100%;
          padding: 6px 8px;
          border: 1px solid #b8c0c9;
          border-radius: 2px;
          font-size: 13px;
          box-sizing: border-box;
        }
        .buttonRow {
          margin-top: 20px;
          display: flex;
          gap: 8px;
        }
        .btnPrimary,
        .btnSecondary {
          padding: 6px 18px;
          font-size: 13px;
          border-radius: 2px;
          cursor: pointer;
        }
        .btnPrimary {
          background: #0b3d91;
          color: #fff;
          border: 1px solid #0b3d91;
        }
        .btnPrimary:disabled {
          opacity: 0.6;
          cursor: default;
        }
        .btnSecondary {
          background: #f0f0f0;
          color: #333;
          border: 1px solid #b8c0c9;
        }
        .error {
          color: #b3261e;
          font-size: 13px;
          margin-bottom: 8px;
        }
      `}</style>
    </div>
  );
}
