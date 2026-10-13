import Link from "next/link";
import { signOut } from "@/auth";
import Brand from "@/components/layout/Brand";
import Icon, { type IconName } from "@/components/ui/Icon";

type AppShellProps = {
  children: React.ReactNode;
  section: "dashboard" | "resources" | "reservations";
  title: string;
  userName?: string;
  role?: "ADMIN" | "MEMBER";
};

const navigation: { key: "dashboard" | "resources" | "reservations"; href: string; label: string; icon: IconName; admin: boolean }[] = [
  { key: "dashboard", href: "/dashboard", label: "Overview", icon: "grid", admin: true },
  { key: "resources", href: "/resources", label: "Resources", icon: "layers", admin: true },
  { key: "reservations", href: "/reservations", label: "Reservations", icon: "calendar", admin: false },
];

export default async function AppShell({ children, section, title, userName, role = "ADMIN" }: AppShellProps) {
  const visibleLinks = navigation.filter((item) => !item.admin || role === "ADMIN");
  const roleName = role === "ADMIN" ? "Administrator" : "Member";
  const displayName = userName || (role === "ADMIN" ? "ReserveHub Admin" : "Member");

  async function logout() {
    "use server";
    await signOut({ redirectTo: "/login" });
  }

  return (
    <div className="rh-app">
      <aside className="rh-sidebar">
        <div>
          <div className="rh-sidebar-top"><Brand light href={role === "ADMIN" ? "/dashboard" : "/reservations"} /></div>
          <div className="rh-workspace-label">WORKSPACE <span>01</span></div>
          <nav aria-label="Primary navigation" className="rh-sidebar-nav">
            <span className="rh-nav-label">MAIN MENU</span>
            {visibleLinks.map((item) => (
              <Link key={item.key} href={item.href} aria-current={section === item.key ? "page" : undefined} className={`rh-nav-item ${section === item.key ? "rh-nav-item--active" : ""}`}>
                <Icon name={item.icon} size={20} /><span>{item.label}</span>{section === item.key && <span className="rh-nav-current" />}
              </Link>
            ))}
            <span className="rh-nav-label rh-nav-label--secondary">GENERAL</span>
            <Link href="/" className="rh-nav-item"><Icon name="home" size={20} /><span>Visit website</span></Link>
          </nav>
        </div>
        <div className="rh-sidebar-bottom">
          <div className="rh-sidebar-help"><div className="rh-sidebar-help-icon"><Icon name="shield" size={20} /></div><strong>Reliable reservations</strong><p>Protected access and conflict-aware booking.</p></div>
          <form action={logout}><button type="submit" className="rh-sidebar-signout"><Icon name="logout" size={18}/> Sign out</button></form>
        </div>
      </aside>

      <div className="rh-app-body">
        <header className="rh-app-header">
          <div className="rh-app-header-left"><span className="rh-app-breadcrumb">Workspace <Icon name="chevron-right" size={14}/></span><strong>{title}</strong></div>
          <div className="rh-account"><span className="rh-account-status"/><span className="rh-account-name">{displayName}</span><span className="rh-account-avatar">{displayName.trim().charAt(0).toUpperCase()}</span></div>
        </header>
        <div className="rh-mobile-bar">
          <Brand href={role === "ADMIN" ? "/dashboard" : "/reservations"}/>
          <details className="rh-mobile-menu"><summary aria-label="Open navigation"><Icon name="menu" size={22}/></summary>
            <nav aria-label="Mobile navigation">{visibleLinks.map((item) => <Link key={item.href} href={item.href}><Icon name={item.icon} size={17}/>{item.label}</Link>)}<Link href="/"><Icon name="home" size={17}/>Website</Link><form action={logout}><button type="submit"><Icon name="logout" size={17}/>Sign out</button></form></nav>
          </details>
        </div>
        <div className="rh-app-content">{children}</div>
        <footer className="rh-app-footer"><span>© 2026 ReserveHub</span><span>Resource Reservation Management System</span></footer>
      </div>
    </div>
  );
}
