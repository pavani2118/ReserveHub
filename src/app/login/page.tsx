import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import Brand from "@/components/layout/Brand";
import Icon from "@/components/ui/Icon";

export const metadata: Metadata = { title: "Sign In | ReserveHub" };

export default function LoginPage() {
  return (
    <main className="rh-login-page">
      <div className="rh-login-top"><Brand/><Link href="/" className="rh-back-link"><Icon name="arrow-left" size={16}/> Back to website</Link></div>
      <div className="rh-login-layout">
        <div className="rh-login-panel">
          <div className="rh-eyebrow"><span className="rh-eyebrow-dot"/> SECURE WORKSPACE ACCESS</div>
          <h1>Welcome back<span>.</span></h1>
          <p className="rh-login-subtitle">Sign in to your account to manage resources, create reservations and keep your team on schedule.</p>
          <div className="rh-login-form-card"><h2>Sign in to ReserveHub</h2><p>Enter your account credentials to continue.</p><LoginForm/></div>
          <div className="rh-login-footnote"><Icon name="lock" size={15}/> Your workspace is protected by secure authentication.</div>
        </div>
        <div className="rh-login-art"><div className="rh-login-art-orbit rh-login-art-orbit--1"/><div className="rh-login-art-orbit rh-login-art-orbit--2"/><div className="rh-login-art-content"><div className="rh-login-art-kicker"><Icon name="sparkles" size={18}/> RESOURCE MANAGEMENT MADE SIMPLE</div><h2>Your entire workspace,<br/>beautifully connected.</h2><p>One secure place to organise shared resources and keep every booking under control.</p><div className="rh-login-art-cards"><div><span><Icon name="calendar" size={20}/></span><strong>Easy reservations</strong><small>Book with confidence</small></div><div><span><Icon name="shield" size={20}/></span><strong>Smart protection</strong><small>No overlapping bookings</small></div><div><span><Icon name="layers" size={20}/></span><strong>All in one place</strong><small>Manage every resource</small></div></div></div><div className="rh-login-art-bottom">RESERVEHUB <span>•</span> WORK SMARTER, EVERY DAY</div></div>
      </div>
      <footer className="rh-login-footer">© 2026 ReserveHub. Resource Reservation Management System.</footer>
    </main>
  );
}
