import Icon, { type IconName } from "@/components/ui/Icon";

const features: { number: string; title: string; description: string; icon: IconName }[] = [
  { number: "01", title: "Resource directory", description: "Keep every meeting room, facility and shared resource organised in one place.", icon: "layers" },
  { number: "02", title: "Conflict-free bookings", description: "Reserve available time slots with built-in overlap prevention and scheduling rules.", icon: "calendar" },
  { number: "03", title: "Complete visibility", description: "Review reservations, monitor resource availability and manage cancellations easily.", icon: "grid" },
];

export default function FeaturesSection() {
  return (
    <>
      <section className="rh-feature-section" id="features">
        <div className="rh-section-head"><div><div className="rh-eyebrow"><span className="rh-eyebrow-dot"/> BUILT FOR EFFICIENCY</div><h2>Everything your team needs<br/>to stay organised.</h2></div><p>Thoughtfully designed tools to make everyday resource coordination simple and dependable.</p></div>
        <div className="rh-feature-grid">{features.map((feature) => <article key={feature.number} className="rh-feature-card"><div className="rh-feature-icon"><Icon name={feature.icon} size={25}/></div><span className="rh-feature-number">{feature.number} / CORE FEATURE</span><h3>{feature.title}</h3><p>{feature.description}</p><span className="rh-feature-arrow"><Icon name="arrow-right" size={19}/></span></article>)}</div>
      </section>
      <section id="how-it-works" className="rh-how"><div className="rh-how-intro"><div className="rh-eyebrow rh-eyebrow--light"><span className="rh-eyebrow-dot"/> THE WORKFLOW</div><h2>A simpler way to coordinate.</h2><p>From selecting a resource to managing your booking, everything happens in one connected workspace.</p></div><div className="rh-how-steps"><div><span>01</span><strong>Choose a resource</strong><p>Browse the available facilities.</p></div><div><span>02</span><strong>Pick your time</strong><p>Select an available time slot.</p></div><div><span>03</span><strong>Manage bookings</strong><p>Track or cancel reservations.</p></div></div></section>
    </>
  );
}
