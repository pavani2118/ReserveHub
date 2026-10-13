import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import Icon from "@/components/ui/Icon";

export default function Home() {
  return (
    <main className="rh-public-page">
      <Navbar />
      <div className="rh-public-main"><HeroSection/><FeaturesSection/></div>
      <footer className="rh-public-footer"><span>© 2026 ReserveHub. Designed for better coordination.</span><Link href="/login">Go to workspace <Icon name="arrow-right" size={16}/></Link></footer>
    </main>
  );
}
