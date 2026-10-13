import Link from "next/link";
import Brand from "@/components/layout/Brand";
import Icon from "@/components/ui/Icon";

export default function Navbar() {
  return (
    <header className="rh-public-header">
      <nav className="rh-public-nav" aria-label="Main navigation">
        <Brand />
        <div className="rh-public-nav-links"><a href="#features">Features</a><a href="#how-it-works">How it works</a></div>
        <Link href="/login" className="rh-button rh-button--primary rh-nav-login">Open workspace <Icon name="arrow-right" size={17}/></Link>
      </nav>
    </header>
  );
}
