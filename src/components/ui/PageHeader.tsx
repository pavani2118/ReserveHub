import type { ReactNode } from "react";

export default function PageHeader({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description: string; actions?: ReactNode }) {
  return (
    <div className="rh-page-header">
      <div><div className="rh-eyebrow"><span className="rh-eyebrow-dot"/>{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>
      {actions && <div className="rh-page-actions">{actions}</div>}
    </div>
  );
}
