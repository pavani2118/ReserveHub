import Icon, { type IconName } from "@/components/ui/Icon";

type StatCardProps = { title: string; value: number; description: string; icon?: IconName; tone?: "blue" | "purple" | "teal"; };
export default function StatCard({ title, value, description, icon = "grid", tone = "blue" }: StatCardProps) {
  return <article className="rh-stat-card"><div className="rh-stat-top"><span className={`rh-stat-icon rh-stat-icon--${tone}`}><Icon name={icon} size={23}/></span><span className="rh-stat-decor"><Icon name="trending" size={18}/></span></div><p className="rh-stat-title">{title}</p><div className="rh-stat-value">{value.toLocaleString("en-LK")}</div><p className="rh-stat-description">{description}</p></article>;
}
