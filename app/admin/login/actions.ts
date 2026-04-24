"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type LoginResult = { error: string } | { ok: true };

export async function signInAction(formData: FormData): Promise<LoginResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "email and password required" };
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail && email.toLowerCase() !== adminEmail.toLowerCase()) {
    return { error: "this account is not authorized" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect("/admin");
}
