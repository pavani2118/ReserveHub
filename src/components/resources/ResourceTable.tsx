"use client";
import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import ResourceStatusButton from "./ResourceStatusButton";

type ResourceItem = { id: string; name: string; location: string | null; description: string | null; capacity: number | null; isActive: boolean };
type Props = { resources: ResourceItem[] };
export default function ResourceTable({ resources }: Props) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const visibleResources = resources.filter((resource) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || [resource.name, resource.location, resource.description]
      .some((value) => (value || "").toLowerCase().includes(query));
    const matchesStatus = filter === "all" || (filter === "active" ? resource.isActive : !resource.isActive);
    return matchesSearch && matchesStatus;
  });
  return (
    <section className="rh-panel rh-table-panel"><div className="rh-panel-heading"><div><span className="rh-mini-eyebrow">INVENTORY</span><h2>All resources</h2><p>{resources.length} registered resources in your workspace.</p></div><span className="rh-count-badge">{resources.length} total</span></div>
      {resources.length > 0 && <div className="rh-table-toolbar"><label className="rh-search-box"><Icon name="search" size={17}/><input aria-label="Search resources" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search resources..."/></label><select aria-label="Filter resources by status" value={filter} onChange={(event) => setFilter(event.target.value as "all" | "active" | "inactive")}><option value="all">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option></select></div>}
      {visibleResources.length === 0 ? <div className="rh-empty"><span className="rh-empty-icon"><Icon name="layers" size={28}/></span><h3>No matching resources</h3><p>Try another search, change the filter or add a resource.</p></div> : <div className="rh-table-scroll"><table className="rh-table"><thead><tr><th>Resource</th><th>Location</th><th>Capacity</th><th>Status</th><th>Actions</th></tr></thead><tbody>{visibleResources.map((resource) => <tr key={resource.id}><td><div className="rh-item-cell"><span className="rh-item-icon"><Icon name="door" size={20}/></span><div><strong>{resource.name}</strong><small>{resource.description || "Shared resource"}</small></div></div></td><td className="rh-cell-muted"><span className="rh-location"><Icon name="pin" size={15}/>{resource.location || "Not specified"}</span></td><td className="rh-cell-muted">{resource.capacity != null ? `${resource.capacity} people` : "—"}</td><td><span className={`rh-badge ${resource.isActive ? "rh-badge--success" : "rh-badge--neutral"}`}><span className="rh-badge-dot"/>{resource.isActive ? "Active" : "Inactive"}</span></td><td><div className="rh-row-actions"><Link href={`/resources/${resource.id}/edit`} className="rh-table-action rh-table-action--edit"><Icon name="edit" size={15}/> Edit</Link><ResourceStatusButton resourceId={resource.id} isActive={resource.isActive}/></div></td></tr>)}</tbody></table></div>}
    </section>
  );
}
