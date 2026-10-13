"use client";
import { useActionState, useEffect, useRef } from "react";
import { createResourceAction } from "@/actions/resources";
import Icon from "@/components/ui/Icon";

export default function ResourceForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(createResourceAction, {ok: false, message: ""});
  useEffect(() => { if (state.ok) formRef.current?.reset(); }, [state]);
  return (
    <section className="rh-panel rh-create-panel"><div className="rh-panel-heading"><div><span className="rh-mini-eyebrow">CREATE NEW</span><h2>Add resource</h2><p>Register a facility in your workspace.</p></div><span className="rh-heading-icon"><Icon name="plus" size={22}/></span></div>
      <form ref={formRef} action={formAction} className="rh-form rh-panel-form">
        <div className="rh-field"><label htmlFor="name">Resource name <span>*</span></label><input id="name" name="name" required minLength={2} maxLength={100} placeholder="e.g. Conference Room A" /></div>
        <div className="rh-field"><label htmlFor="location">Location <span>*</span></label><input id="location" name="location" required maxLength={120} placeholder="e.g. First Floor, Block A" /></div>
        <div className="rh-field"><label htmlFor="capacity">Capacity <span>*</span></label><input id="capacity" name="capacity" type="number" min="1" max="10000" step="1" required placeholder="e.g. 20" /></div>
        <div className="rh-field"><label htmlFor="description">Description <span className="rh-optional">(Optional)</span></label><textarea id="description" name="description" maxLength={500} rows={3} placeholder="Describe the resource..."/></div>
        {state.message && <div role="status" className={`rh-alert ${state.ok ? "rh-alert--success" : "rh-alert--error"}`}>{state.message}</div>}
        <button disabled={pending} type="submit" className="rh-button rh-button--primary rh-button--full"><Icon name="plus" size={18}/>{pending ? "Saving resource..." : "Add resource"}</button>
      </form>
    </section>
  );
}
