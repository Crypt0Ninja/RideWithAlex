import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getAdminOrNull(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail && data.user.email?.toLowerCase() !== adminEmail.toLowerCase()) {
    return null;
  }

  return data.user;
}

export async function requireAdmin(): Promise<User> {
  const user = await getAdminOrNull();
  if (!user) redirect("/admin/login");
  return user;
}
