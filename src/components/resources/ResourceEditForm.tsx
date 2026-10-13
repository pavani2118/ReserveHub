"use client";
import { useActionState } from "react";
import Link from "next/link";
import { updateResourceAction } from "@/actions/edit-resource";
import Icon from "@/components/ui/Icon";

type Resource = { id: string; name: string; location: string | null; capacity: number | null; description: string | null };
export default function ResourceEditForm({ resource }: { resource: Resource }) {
  const [state, formAction, pending] = useActionState(updateResourceAction, { error: "" });
  return (
    <form action={formAction} className="rh-form">
      <input type="hidden" name="id" value={resource.id}/>
      <div className="rh-field"><label htmlFor="name">Resource name <span>*</span></label><input id="name" name="name" defaultValue={resource.name} required minLength={2} maxLength={100}/></div>
      <div className="rh-field"><label htmlFor="location">Location <span>*</span></label><input id="location" name="location" defaultValue={resource.location ?? ""} required minLength={2} maxLength={120}/></div>
      <div className="rh-field"><label htmlFor="capacity">Capacity <span>*</span></label><input id="capacity" name="capacity" type="number" min="1" max="10000" step="1" required defaultValue={resource.capacity ?? ""}/></div>
      <div className="rh-field"><label htmlFor="description">Description <span className="rh-optional">(Optional)</span></label><textarea id="description" name="description" rows={4} maxLength={500} defaultValue={resource.description ?? ""}/></div>
      {state.error && <div role="alert" className="rh-alert rh-alert--error">{state.error}</div>}
      <div className="rh-form-actions"><Link href="/resources" className="rh-button rh-button--outline"><Icon name="arrow-left" size={17}/> Cancel</Link><button type="submit" disabled={pending} className="rh-button rh-button--primary"><Icon name="check" size={18}/>{pending ? "Saving..." : "Save changes"}</button></div>
    </form>
  );
}
