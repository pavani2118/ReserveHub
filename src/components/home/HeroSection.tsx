import Link from "next/link";
import Icon from "@/components/ui/Icon";

export default function HeroSection() {
  return (
    <section className="rh-hero">
      <div className="rh-hero-copy">
        <div className="rh-hero-kicker"><span className="rh-status-dot"/> THE SMARTER WAY TO BOOK RESOURCES</div>
        <h1>Every resource.<br/><span>One organised</span><br/>workspace.</h1>
        <p>From meeting rooms to shared equipment, ReserveHub brings your resources, schedules and reservations together in one reliable platform.</p>
        <div className="rh-hero-buttons"><Link href="/login" className="rh-button rh-button--primary rh-button--large">Get started <Icon name="arrow-right" size={19}/></Link><a href="#features" className="rh-button rh-button--outline rh-button--large">Explore features <Icon name="chevron-right" size={18}/></a></div>
        <div className="rh-hero-proof"><span><Icon name="check" size={16}/> Conflict-aware booking</span><span><Icon name="check" size={16}/> Centralised management</span></div>
      </div>
      <div className="rh-hero-visual" aria-label="Illustration of the ReserveHub booking interface">
        <div className="rh-orbit rh-orbit--one"/><div className="rh-orbit rh-orbit--two"/>
        <div className="rh-preview">
          <div className="rh-preview-top"><div className="rh-preview-brand"><span className="rh-preview-logo"><Icon name="calendar" size={18}/></span><strong>ReserveHub</strong></div><span className="rh-preview-tag">INTERFACE PREVIEW</span></div>
          <div className="rh-preview-heading"><div><small>WORKSPACE / OVERVIEW</small><h3>Good morning 👋</h3><p>Here is your reservation overview.</p></div><span className="rh-preview-avatar">R</span></div>
          <div className="rh-preview-metrics"><div><span>Available rooms</span><strong>08</strong><em>Resources</em></div><div><span>Reservations</span><strong>24</strong><em>Bookings</em></div><div><span>Team members</span><strong>12</strong><em>Users</em></div></div>
          <div className="rh-preview-card-title"><strong>Upcoming bookings</strong><span>This week</span></div>
          <div className="rh-preview-booking"><span className="rh-preview-booking-icon"><Icon name="door" size={19}/></span><div><strong>Conference Room A</strong><small>Team planning session · 10:00 AM</small></div><span className="rh-preview-confirmed">Confirmed</span></div>
          <div className="rh-preview-booking"><span className="rh-preview-booking-icon rh-preview-booking-icon--alt"><Icon name="layers" size={19}/></span><div><strong>Training Room</strong><small>Workshop · 02:30 PM</small></div><span className="rh-preview-confirmed">Confirmed</span></div>
        </div>
        <div className="rh-floating-note"><span className="rh-floating-check"><Icon name="check" size={19}/></span><div><strong>No double bookings</strong><small>Conflicts are prevented</small></div></div>
      </div>
    </section>
  );
}
