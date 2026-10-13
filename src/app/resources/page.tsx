import { Suspense } from "react";
import { connection } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAllResources } from "@/services/resource.service";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import Icon from "@/components/ui/Icon";
import ResourceForm from "@/components/resources/ResourceForm";
import ResourceTable from "@/components/resources/ResourceTable";

async function ResourcesContent() {
  await connection();
  await requireAdmin();
  const resources = await getAllResources();
  const active = resources.filter((resource) => resource.isActive).length;
  return (
    <AppShell section="resources" title="Resources">
      <PageHeader eyebrow="RESOURCE DIRECTORY" title="Resource management" description="Organise your shared spaces, equipment and facilities from one workspace."/>
      <div className="rh-summary-strip"><div><span className="rh-summary-icon"><Icon name="layers" size={21}/></span><div><strong>{resources.length}</strong><small>Total resources</small></div></div><div><span className="rh-summary-icon rh-summary-icon--green"><Icon name="check" size={21}/></span><div><strong>{active}</strong><small>Active resources</small></div></div><div><span className="rh-summary-icon rh-summary-icon--slate"><Icon name="clock" size={21}/></span><div><strong>{resources.length - active}</strong><small>Inactive resources</small></div></div></div>
      <div className="rh-management-grid"><ResourceForm/><ResourceTable resources={resources}/></div>
    </AppShell>
  );
}
export default function ResourcesPage() { return <Suspense fallback={<div className="rh-page-loading">Loading resources...</div>}><ResourcesContent/></Suspense>; }
