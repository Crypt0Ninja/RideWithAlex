import Link from "next/link";

export default function AdminIndex() {
  return (
    <main className="flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <p className="text-white/40 text-xs uppercase tracking-[0.3em]">admin</p>
        <h1 className="text-4xl md:text-5xl font-medium lowercase tracking-tight">
          ridewithalex admin
        </h1>
      </header>
      <ul className="flex flex-col gap-3">
        <li>
          <Link
            href="/admin/google-setup"
            className="text-white hover:text-white/80 underline-offset-4 hover:underline lowercase"
          >
            google calendar setup →
          </Link>
        </li>
      </ul>
    </main>
  );
}
