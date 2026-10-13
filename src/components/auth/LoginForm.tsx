"use client";

import { useActionState } from "react";
import { loginAction } from "@/actions/login";
import Icon from "@/components/ui/Icon";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, { error: null });
  return (
    <form action={formAction} className="rh-form rh-login-form">
      <div className="rh-field"><label htmlFor="email">Email address <span>*</span></label><input id="email" type="email" name="email" placeholder="Enter your email address" autoComplete="email" required /></div>
      <div className="rh-field"><label htmlFor="password">Password <span>*</span></label><input id="password" type="password" name="password" placeholder="Enter your password" autoComplete="current-password" required /></div>
      {state.error && <div role="alert" className="rh-alert rh-alert--error">{state.error}</div>}
      <button type="submit" disabled={pending} className="rh-button rh-button--primary rh-button--full rh-button--large">{pending ? "Signing in..." : "Sign in to workspace"}<Icon name="arrow-right" size={19}/></button>
    </form>
  );
}
