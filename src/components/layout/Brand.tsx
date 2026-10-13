import Link from "next/link";
import Icon from "@/components/ui/Icon";

export default function Brand({ light = false, href = "/" }: { light?: boolean; href?: string }) {
  return (
    <Link href={href} className={`rh-brand ${light ? "rh-brand--light" : ""}`} aria-label="ReserveHub home">
      <span className="rh-brand-mark"><Icon name="calendar" size={24} /></span>
      <span className="rh-brand-wordmark"><strong>ReserveHub</strong><small>RESOURCE WORKSPACE</small></span>
    </Link>
  );
}
