import { redirect } from "next/navigation";
import { getAdminOrNull } from "@/lib/auth/admin";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const existing = await getAdminOrNull();
  if (existing) redirect("/admin");

  return (
    <main className="flex flex-col gap-10 max-w-2xl">
      <header className="flex flex-col gap-4">
        <p className="text-white/40 text-xs uppercase tracking-[0.3em]">admin</p>
        <h1 className="text-4xl md:text-5xl font-medium lowercase tracking-tight">sign in</h1>
        <p className="text-white/70 text-sm md:text-base leading-relaxed lowercase">
          supabase auth · email + password. if you don&apos;t have an account yet, create one
          in the supabase dashboard → authentication → users.
        </p>
      </header>
      <LoginForm />
    </main>
  );
}
