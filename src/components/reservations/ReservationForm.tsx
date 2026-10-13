"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import Icon from "@/components/ui/Icon";

type ResourceOption = { id: string; name: string; location: string | null; capacity: number | null };
type Props = { resources: ResourceOption[] };
type ApiResponse = { success: boolean; message: string };

const MAX_BOOKING_HOURS = 8;
const MAX_DURATION_MS = MAX_BOOKING_HOURS * 60 * 60 * 1000;

export default function ReservationForm({ resources }: Props) {
  const router = useRouter();
  const [resourceId, setResourceId] = useState(resources[0]?.id ?? "");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [purpose, setPurpose] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setSuccess(false);

    if (!resourceId) { setMessage("Please select a resource."); return; }
    const start = new Date(startTime);
    const end = new Date(endTime);
    const startTimestamp = start.getTime();
    const endTimestamp = end.getTime();
    if (!Number.isFinite(startTimestamp) || !Number.isFinite(endTimestamp)) { setMessage("Please select valid dates and times."); return; }
    if (startTimestamp <= Date.now()) { setMessage("Start time must be in the future."); return; }
    if (endTimestamp <= startTimestamp) { setMessage("End time must be after start time."); return; }
    const durationMs = endTimestamp - startTimestamp;
    if (durationMs > MAX_DURATION_MS) { setMessage("Reservation duration cannot exceed 8 hours."); return; }
    const trimmedPurpose = purpose.trim();
    if (trimmedPurpose.length < 3) { setMessage("Please provide a booking purpose (at least 3 characters)."); return; }
    if (trimmedPurpose.length > 250) { setMessage("Booking purpose cannot exceed 250 characters."); return; }

    setPending(true);
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId, startTime: start.toISOString(), endTime: end.toISOString(), purpose: trimmedPurpose }),
      });
      const data: ApiResponse = await response.json();
      if (!response.ok) { setSuccess(false); setMessage(data.message || "Unable to create reservation."); return; }
      setSuccess(true);
      setMessage("Reservation created successfully!");
      setStartTime("");
      setEndTime("");
      setPurpose("");
      router.refresh();
    } catch (error) {
      console.error("Reservation submission failed:", error);
      setSuccess(false);
      setMessage("Unable to connect to the server. Please try again.");
    } finally { setPending(false); }
  }

  if (resources.length === 0) {
    return <section className="rh-panel rh-create-panel"><div className="rh-panel-heading"><div><span className="rh-mini-eyebrow">NEW BOOKING</span><h2>Create reservation</h2><p>Reserve your next available time slot.</p></div><span className="rh-heading-icon"><Icon name="calendar" size={22}/></span></div><div className="rh-panel-form"><div className="rh-alert rh-alert--info"><Icon name="info" size={18}/> No active resources are available for booking. Please contact an administrator.</div></div></section>;
  }

  return (
    <section className="rh-panel rh-create-panel">
      <div className="rh-panel-heading"><div><span className="rh-mini-eyebrow">NEW BOOKING</span><h2>Create reservation</h2><p>Book a time slot for your team.</p></div><span className="rh-heading-icon"><Icon name="plus" size={22}/></span></div>
      <form onSubmit={handleSubmit} className="rh-form rh-panel-form">
        <div className="rh-field"><label htmlFor="resourceId">Resource <span>*</span></label><select id="resourceId" name="resourceId" value={resourceId} onChange={(event) => {setResourceId(event.target.value); setMessage("");}} required>{resources.map((resource) => <option key={resource.id} value={resource.id}>{resource.name}{resource.location ? ` - ${resource.location}` : ""}</option>)}</select></div>
        <div className="rh-field"><label htmlFor="startTime">Start date & time <span>*</span></label><input id="startTime" name="startTime" type="datetime-local" value={startTime} onChange={(event) => {setStartTime(event.target.value); setMessage("");}} required/></div>
        <div className="rh-field"><label htmlFor="endTime">End date & time <span>*</span></label><input id="endTime" name="endTime" type="datetime-local" value={endTime} onChange={(event) => {setEndTime(event.target.value); setMessage("");}} required/></div>
        <div className="rh-field"><label htmlFor="purpose">Booking purpose <span>*</span></label><textarea id="purpose" name="purpose" value={purpose} onChange={(event) => {setPurpose(event.target.value); setMessage("");}} maxLength={250} minLength={3} required rows={3} placeholder="e.g. Project planning meeting"/></div>
        <div className="rh-policy"><span className="rh-policy-icon"><Icon name="shield" size={21}/></span><div><strong>Reservation policy</strong><p>Bookings can be up to 8 hours. Past times and overlapping reservations are not permitted.</p></div></div>
        <p className="rh-form-helper"><Icon name="info" size={15}/> Enter times in your device&apos;s local timezone. Times are stored in UTC.</p>
        {message && <div role="status" aria-live="polite" className={`rh-alert ${success ? "rh-alert--success" : "rh-alert--error"}`}>{message}</div>}
        <button type="submit" disabled={pending} className="rh-button rh-button--primary rh-button--full"><Icon name="calendar" size={18}/>{pending ? "Creating reservation..." : "Confirm reservation"}</button>
      </form>
    </section>
  );
}
