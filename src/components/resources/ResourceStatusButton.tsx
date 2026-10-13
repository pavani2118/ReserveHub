"use client";
import { useFormStatus } from "react-dom";
import { setResourceStatusAction } from "@/actions/resource-status";

type Props = { resourceId: string; isActive: boolean };
function SubmitButton({ isActive }: { isActive: boolean }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className={`rh-table-action ${isActive ? "rh-table-action--danger" : "rh-table-action--success"}`}>{pending ? "Updating..." : isActive ? "Disable" : "Reactivate"}</button>;
}
export default function ResourceStatusButton({ resourceId, isActive }: Props) {
  return <form action={setResourceStatusAction} onSubmit={(event) => {const message = isActive ? "Disable this resource?" : "Reactivate this resource?"; if (!window.confirm(message)) event.preventDefault();}}><input type="hidden" name="id" value={resourceId}/><input type="hidden" name="isActive" value={String(!isActive)}/><SubmitButton isActive={isActive}/></form>;
}
