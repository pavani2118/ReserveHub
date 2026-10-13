"use client";
import { useActionState } from "react";
import { cancelReservationAction } from "@/actions/cancel-reservation";

export default function CancelReservationButton({ reservationId }: { reservationId: string }) {
  const [state, formAction, pending] = useActionState(cancelReservationAction.bind(null, reservationId), {ok: false, message: ""});
  return <form action={formAction} onSubmit={(event) => {if (!window.confirm("Cancel this reservation?")) event.preventDefault();}}><button type="submit" disabled={pending} className="rh-table-action rh-table-action--danger">{pending ? "Cancelling..." : "Cancel booking"}</button>{state.message && <p role="status" className={`rh-small-feedback ${state.ok ? "rh-feedback--success" : "rh-feedback--error"}`}>{state.message}</p>}</form>;
}
