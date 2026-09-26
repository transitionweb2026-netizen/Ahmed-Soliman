"use client";

import { useActionState, useState } from "react";
import { signIn } from "../actions";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(signIn, undefined);
  // Controlled so the email survives React resetting the form after a failed attempt.
  const [email, setEmail] = useState("");

  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="next" value={next} />
      <div className="grid gap-1.5">
        <label htmlFor="email" className="adm-label">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="adm-input"
        />
      </div>
      <div className="grid gap-1.5">
        <label htmlFor="password" className="adm-label">
          Password
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="adm-input" />
      </div>
      {state?.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="adm-btn adm-btn-primary w-full">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
