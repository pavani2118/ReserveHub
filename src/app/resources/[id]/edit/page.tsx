import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getResourceById } from "@/services/resource.service";
import ResourceEditForm from "@/components/resources/ResourceEditForm";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import Icon from "@/components/ui/Icon";

type EditResourcePageProps = { params: Promise<{ id: string }> };

async function EditResourceContent({ params }: EditResourcePageProps) {
  await connection();
  const { id } = await params;
  await requireAdmin();
  const validatedId = z.uuid().safeParse(id);
  if (!validatedId.success) notFound();
  const resource = await getResourceById(validatedId.data);
  if (!resource) notFound();
  return (
    <AppShell section="resources" title="Edit resource">
      <PageHeader eyebrow="RESOURCE DIRECTORY / EDIT" title="Edit resource" description={`Update the information for ${resource.name}.`} actions={<Link href="/resources" className="rh-button rh-button--outline"><Icon name="arrow-left" size={17}/> Back to resources</Link>}/>
      <div className="rh-edit-grid"><div className="rh-panel rh-edit-panel"><div className="rh-panel-heading"><div><span className="rh-mini-eyebrow">RESOURCE DETAILS</span><h2>Update information</h2><p>Make changes below and save when you&apos;re ready.</p></div><span className="rh-heading-icon"><Icon name="edit" size={21}/></span></div><div className="rh-panel-form"><ResourceEditForm resource={{id: resource.id, name: resource.name, location: resource.location, capacity: resource.capacity, description: resource.description}}/></div></div><aside className="rh-edit-tip"><span><Icon name="info" size={24}/></span><h3>Keep details accurate</h3><p>Clear names, locations and capacities help people choose the right resource when making a reservation.</p><div className="rh-edit-tip-line"/><small>Changes to resource details do not remove existing reservations.</small></aside></div>
    </AppShell>
  );
}
export default function EditResourcePage({ params }: EditResourcePageProps) { return <Suspense fallback={<div className="rh-page-loading">Loading resource details...</div>}><EditResourceContent params={params}/></Suspense>; }
