"use client";
import { useState } from "react";
import Icon from "@/components/ui/Icon";
import CancelReservationButton from "./CancelReservationButton";

type ReservationRow = {
  id: string; purpose: string | null; status: "CONFIRMED" | "CANCELLED"; startTime: Date; endTime: Date;
  resource: { name: string; location: string | null };
  user: { name: string };
};
type Props = { reservations: ReservationRow[] };
const dateFormatter = new Intl.DateTimeFormat("en-LK", { timeZone: "Asia/Colombo", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true });
export default function ReservationTable({ reservations }: Props) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "CONFIRMED" | "CANCELLED">("all");
  const visibleReservations = reservations.filter((reservation) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || [reservation.resource.name, reservation.resource.location, reservation.user.name, reservation.purpose]
      .some((value) => (value || "").toLowerCase().includes(query));
    return matchesSearch && (status === "all" || reservation.status === status);
  });
  return (
    <section className="rh-panel rh-table-panel"><div className="rh-panel-heading"><div><span className="rh-mini-eyebrow">BOOKING ACTIVITY</span><h2>Reservation history</h2><p>Showing up to 100 recent reservations.</p></div><span className="rh-count-badge">{reservations.length} records</span></div>
      {reservations.length > 0 && <div className="rh-table-toolbar"><label className="rh-search-box"><Icon name="search" size={17}/><input aria-label="Search reservations" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search bookings..."/></label><select aria-label="Filter reservations by status" value={status} onChange={(event) => setStatus(event.target.value as "all" | "CONFIRMED" | "CANCELLED")}><option value="all">All statuses</option><option value="CONFIRMED">Confirmed</option><option value="CANCELLED">Cancelled</option></select></div>}
      {visibleReservations.length === 0 ? <div className="rh-empty"><span className="rh-empty-icon"><Icon name="calendar" size={28}/></span><h3>No matching reservations</h3><p>Try another search or status filter, or create a booking.</p></div> : <div className="rh-table-scroll"><table className="rh-table rh-table--reservations"><thead><tr><th>Resource</th><th>Date & time (Sri Lanka)</th><th>Purpose</th><th>Booked by</th><th>Status</th><th>Actions</th></tr></thead><tbody>{visibleReservations.map((reservation) => <tr key={reservation.id}><td><div className="rh-item-cell"><span className="rh-item-icon"><Icon name="door" size={20}/></span><div><strong>{reservation.resource.name}</strong><small>{reservation.resource.location || "Location not specified"}</small></div></div></td><td><div className="rh-time-cell"><strong>{dateFormatter.format(reservation.startTime)}</strong><small>to {dateFormatter.format(reservation.endTime)}</small></div></td><td className="rh-cell-muted rh-purpose-cell">{reservation.purpose || "—"}</td><td className="rh-cell-muted">{reservation.user.name}</td><td><span className={`rh-badge ${reservation.status === "CONFIRMED" ? "rh-badge--success" : "rh-badge--neutral"}`}><span className="rh-badge-dot"/>{reservation.status === "CONFIRMED" ? "Confirmed" : "Cancelled"}</span></td><td>{reservation.status === "CONFIRMED" ? <CancelReservationButton reservationId={reservation.id}/> : <span className="rh-cell-muted rh-cell-muted--small">No actions</span>}</td></tr>)}</tbody></table></div>}
    </section>
  );
}
