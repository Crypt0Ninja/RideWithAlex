import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

export default async function AdminIndex() {
  const user = await requireAdmin();

  const links = [
    { href: "/admin/bookings", label: "bookings →" },
    { href: "/admin/google-setup", label: "google calendar setup →" },
  ];

  return (
    <main className="flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <p className="text-white/40 text-xs uppercase tracking-[0.3em]">admin</p>
        <h1 className="text-4xl md:text-5xl font-medium lowercase tracking-tight">
          ridewithalex admin
        </h1>
        <p className="text-white/60 text-sm lowercase">signed in as {user.email}</p>
      </header>
      <ul className="flex flex-col gap-3">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className="text-white hover:text-white/80 underline-offset-4 hover:underline lowercase"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
