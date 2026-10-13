import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getActiveResources } from "@/services/resource.service";
import { getReservationsForUser } from "@/services/reservation.service";
import ReservationForm from "@/components/reservations/ReservationForm";
import ReservationTable from "@/components/reservations/ReservationTable";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import Icon from "@/components/ui/Icon";

async function ReservationsContent() {
  await connection();
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const user = await prisma.user.findUnique({where: {id: session.user.id}, select: { id: true, name: true, role: true }});
  if (!user) redirect("/login");
  const [resources, reservations] = await Promise.all([getActiveResources(), getReservationsForUser(user.id, user.role === "ADMIN")]);
  const confirmed = reservations.filter((r) => r.status === "CONFIRMED").length;
  const cancelled = reservations.filter((r) => r.status === "CANCELLED").length;
  return (
    <AppShell section="reservations" title="Reservations" userName={user.name} role={user.role}>
      <PageHeader eyebrow="BOOKING WORKSPACE" title="Reservation management" description="Book resources, prevent scheduling conflicts and keep track of every reservation."/>
      <div className="rh-summary-strip"><div><span className="rh-summary-icon"><Icon name="layers" size={21}/></span><div><strong>{resources.length}</strong><small>Available resources</small></div></div><div><span className="rh-summary-icon rh-summary-icon--green"><Icon name="calendar" size={21}/></span><div><strong>{confirmed}</strong><small>Confirmed bookings</small></div></div><div><span className="rh-summary-icon rh-summary-icon--slate"><Icon name="clock" size={21}/></span><div><strong>{cancelled}</strong><small>Cancelled bookings</small></div></div></div>
      <div className="rh-management-grid"><ReservationForm resources={resources}/><ReservationTable reservations={reservations}/></div>
    </AppShell>
  );
}
export default function ReservationsPage() { return <Suspense fallback={<div className="rh-page-loading">Loading reservations...</div>}><ReservationsContent/></Suspense>; }
