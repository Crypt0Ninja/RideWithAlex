"use client";

import { useState, useTransition } from "react";
import { signInAction } from "./actions";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await signInAction(formData);
      if (result && "error" in result) {
        setError(result.error);
      }
    });
  }

  const inputClass =
    "w-full rounded-2xl border border-white/10 bg-neutral-900 px-5 py-4 text-white placeholder-white/30 focus:border-white/40 focus:outline-none text-base";
  const labelClass = "text-white/70 text-xs uppercase tracking-[0.3em]";

  return (
    <form action={handleSubmit} className="flex flex-col gap-5 max-w-sm">
      <label className="flex flex-col gap-2">
        <span className={labelClass}>email</span>
        <input type="email" name="email" required className={inputClass} autoComplete="email" />
      </label>
      <label className="flex flex-col gap-2">
        <span className={labelClass}>password</span>
        <input
          type="password"
          name="password"
          required
          className={inputClass}
          autoComplete="current-password"
        />
      </label>

      {error && <p className="text-red-300 text-sm lowercase">error: {error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-white text-black px-8 py-4 text-sm font-medium lowercase hover:bg-white/90 transition-colors disabled:opacity-40"
      >
        {pending ? "signing in..." : "sign in →"}
      </button>
    </form>
  );
}
