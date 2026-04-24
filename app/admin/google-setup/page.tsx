import { getConnectedEmail } from "@/lib/google/oauth";
import { requireAdmin } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ connected?: string; error?: string }>;
};

export default async function GoogleSetupPage({ searchParams }: Props) {
  await requireAdmin();
  const params = await searchParams;
  const email = await getConnectedEmail();

  return (
    <main className="flex flex-col gap-10 max-w-2xl">
      <header className="flex flex-col gap-4">
        <p className="text-white/40 text-xs uppercase tracking-[0.3em]">google calendar</p>
        <h1 className="text-4xl md:text-5xl font-medium lowercase tracking-tight">
          connect google calendar
        </h1>
        <p className="text-white/70 text-sm md:text-base leading-relaxed lowercase">
          authorize ridewithalex to create calendar events when bookings come in. uses your
          google calendar (primary). one-time setup — tokens refresh automatically.
        </p>
      </header>

      {params.error && (
        <div className="rounded-3xl border border-red-500/30 bg-red-500/5 p-6 text-red-300 text-sm lowercase">
          error: {params.error.replace(/_/g, " ")}
        </div>
      )}

      {params.connected && (
        <div className="rounded-3xl border border-white/10 bg-neutral-900 p-6 text-white/80 text-sm lowercase">
          just connected as <span className="font-medium">{params.connected}</span>
        </div>
      )}

      {email ? (
        <div className="flex flex-col gap-6">
          <div className="rounded-3xl border border-white/10 bg-neutral-900 p-8 flex flex-col gap-3">
            <p className="text-white/40 text-xs uppercase tracking-[0.3em]">status</p>
            <p className="text-white text-xl font-medium lowercase">connected</p>
            <p className="text-white/60 text-sm lowercase">account: {email}</p>
          </div>
          <form action="/api/auth/google/init" method="get">
            <button
              type="submit"
              className="text-white/60 hover:text-white text-xs uppercase tracking-[0.3em]"
            >
              reconnect (switch account) →
            </button>
          </form>
        </div>
      ) : (
        <form action="/api/auth/google/init" method="get">
          <button
            type="submit"
            className="rounded-full bg-white text-black px-8 py-4 text-sm font-medium lowercase hover:bg-white/90 transition-colors"
          >
            connect google calendar →
          </button>
        </form>
      )}
    </main>
  );
}
