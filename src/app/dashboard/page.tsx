import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import Icon from "@/components/ui/Icon";
import StatCard from "@/components/dashboard/StatCard";

async function DashboardContent() {
  await connection();
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { name: true, role: true } });
  if (!user || user.role !== "ADMIN") redirect("/");
  const [resources, bookings, users] = await Promise.all([
    prisma.resource.count({ where: { isActive: true } }),
    prisma.reservation.count({ where: { status: "CONFIRMED" } }),
    prisma.user.count(),
  ]);

  return (
    <AppShell section="dashboard" title="Overview" userName={user.name} role={user.role}>
      <PageHeader eyebrow="ADMIN DASHBOARD" title={`Welcome back, ${user.name.split(" ")[0] || "Admin"}`} description="Here is what's happening across your resource workspace." actions={<Link href="/reservations" className="rh-button rh-button--primary"><Icon name="plus" size={18}/> New reservation</Link>} />
      <div className="rh-stats-grid">
        <StatCard title="Active resources" value={resources} description="Resources available to reserve" icon="layers" tone="blue"/>
        <StatCard title="Confirmed bookings" value={bookings} description="Currently confirmed reservations" icon="calendar" tone="teal"/>
        <StatCard title="Registered users" value={users} description="People in your workspace" icon="users" tone="purple"/>
      </div>
      <div className="rh-dashboard-grid">
        <section className="rh-panel rh-dashboard-actions"><div className="rh-panel-heading"><div><span className="rh-mini-eyebrow">QUICK ACCESS</span><h2>Workspace management</h2><p>Everything you need, one click away.</p></div></div>
          <Link href="/resources" className="rh-action-row"><span className="rh-action-icon rh-action-icon--blue"><Icon name="layers" size={23}/></span><span className="rh-action-info"><strong>Manage resources</strong><small>Add, edit and manage shared facilities</small></span><span className="rh-action-chevron"><Icon name="arrow-right" size={19}/></span></Link>
          <Link href="/reservations" className="rh-action-row"><span className="rh-action-icon rh-action-icon--cyan"><Icon name="calendar" size={23}/></span><span className="rh-action-info"><strong>Manage reservations</strong><small>Create bookings and review schedules</small></span><span className="rh-action-chevron"><Icon name="arrow-right" size={19}/></span></Link>
        </section>
        <section className="rh-dashboard-aside"><div className="rh-aside-icon"><Icon name="shield" size={27}/></div><span className="rh-aside-kicker">RESERVEHUB WORKSPACE</span><h2>Better bookings.<br/>Less complexity.</h2><p>Keep your workspace organised with secure access, resource visibility and conflict-aware reservations.</p><Link href="/reservations" className="rh-aside-link">Go to reservations <Icon name="arrow-right" size={18}/></Link><div className="rh-aside-decoration"/></section>
      </div>
      <div className="rh-footnote"><Icon name="info" size={16}/> Dashboard figures reflect the current database records.</div>
    </AppShell>
  );
}

export default function DashboardPage() {
  return <Suspense fallback={<div className="rh-page-loading">Loading dashboard...</div>}><DashboardContent/></Suspense>;
}
