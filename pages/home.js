import { useEffect } from "react";
import { getAuthCookie } from "../lib/session";

export async function getServerSideProps({ req }) {
  const auth = getAuthCookie(req);
  if (!auth) {
    return { redirect: { destination: "/", permanent: false } };
  }
  return { props: { email: auth.email } };
}

export default function HomePage({ email }) {
  useEffect(() => {
    const link = document.querySelector('[data-test="download-report-link"]');
    if (link) link.click();
  }, []);

  return (
    <div className="page">
      <div className="topbar">
        <span className="topbarBrand">NSE MF Platform</span>
        <span className="topbarDesk">Desk &middot; Test Portal</span>
        <span className="topbarVersion">v0.1 (test)</span>
      </div>

      <div className="hero">
        <div className="card">
          <h1 data-test="home-welcome">Welcome, {email}</h1>
          <p className="subtext">You are logged in.</p>
          <a href="/api/download-report" className="downloadLink" data-test="download-report-link">
            Download report
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
          width: 360px;
          text-align: center;
        }
        h1 {
          font-size: 18px;
          color: #3d2a8c;
          margin-bottom: 8px;
        }
        .subtext {
          font-size: 13px;
          color: #666;
          margin-bottom: 20px;
        }
        .downloadLink {
          display: inline-block;
          padding: 10px 20px;
          background: #3d2a8c;
          color: #fff;
          border-radius: 4px;
          font-size: 14px;
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}
