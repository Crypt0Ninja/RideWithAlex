import Link from "next/link";
import { Onest } from "next/font/google";
import { getAdminOrNull } from "@/lib/auth/admin";
import "../globals.css";

const onest = Onest({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-onest",
  display: "swap",
});

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdminOrNull();

  return (
    <html lang="en" className={onest.variable}>
      <body className="min-h-screen bg-black text-white font-sans antialiased">
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-16">
          <nav className="mb-16 flex items-center justify-between gap-6">
            <Link
              href="/admin"
              className="text-white/60 hover:text-white text-xs uppercase tracking-[0.3em]"
            >
              admin
            </Link>
            <div className="flex items-center gap-6">
              {user && (
                <form action="/admin/logout" method="post">
                  <button
                    type="submit"
                    className="text-white/40 hover:text-white text-xs uppercase tracking-[0.3em]"
                  >
                    sign out
                  </button>
                </form>
              )}
              <Link
                href="/"
                className="text-white/40 hover:text-white text-xs uppercase tracking-[0.3em]"
              >
                ← back to site
              </Link>
            </div>
          </nav>
          {children}
        </div>
      </body>
    </html>
  );
}
