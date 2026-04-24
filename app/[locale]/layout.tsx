import type { Metadata } from "next";
import { Onest } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

const onest = Onest({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ridewithalex.vercel.app";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const defaultTitle =
    locale === "bg"
      ? "ridewithalex — частни уроци по сноуборд в банско"
      : "ridewithalex — private snowboard lessons in bansko";

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: defaultTitle,
      template: "%s — ridewithalex",
    },
    description: t("tagline"),
    icons: { icon: "/favicon.svg" },
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `/${l}`]),
      ),
    },
    authors: [{ name: "Alex", url: BASE_URL }],
    creator: "Alex",
    keywords: [
      "snowboard",
      "snowboarding",
      "bansko",
      "lessons",
      "private snowboard instructor",
      "сноуборд",
      "банско",
      "уроци",
      "instructor",
      "bulgaria",
      "pirin",
      "ski resort",
    ],
    applicationName: "RideWithAlex",
    referrer: "origin-when-cross-origin",
    formatDetection: {
      email: true,
      telephone: true,
      address: false,
    },
    verification: {
      // Google Search Console: verified via alternative method (not DNS TXT/meta)
      other: {
        "msvalidate.01": "F887B80F2552177510FEFE9EC938A775",
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "bg" ? "bg_BG" : "en_GB",
      siteName: "ridewithalex",
      title: defaultTitle,
      description: t("tagline"),
      url: `/${locale}`,
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description: t("tagline"),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html lang={locale} className={onest.className}>
      <body className="bg-black text-white antialiased min-h-screen">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
