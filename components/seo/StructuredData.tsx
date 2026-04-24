/**
 * JSON-LD structured data helpers for rich search results.
 *
 * Schema.org types used:
 *   - LocalBusiness (home) — drives "snowboard instructor Bansko" map pack
 *   - BreadcrumbList (inner pages) — shows breadcrumb trail in SERP
 *   - FAQPage (/contact) — Google FAQ rich result
 *   - Service (/lessons) — service-specific rich result
 *   - SportsActivityLocation alias — extends LocalBusiness
 *
 * Each helper returns a <script type="application/ld+json"> node that can
 * be dropped anywhere in the tree. Next.js inlines them server-side so
 * crawlers see the JSON without needing to run JS.
 */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ridewithalex.org";

type JsonLdProps = { data: unknown };

function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "SportsActivityLocation"],
    "@id": `${SITE_URL}/#business`,
    name: "RideWithAlex",
    alternateName: "Ride With Alex",
    description:
      "Private snowboard lessons in Bansko, Bulgaria. Adults, kids, and groups. Flexible packages from 2 hours to a full week.",
    url: SITE_URL,
    telephone: "+359885137471",
    email: "alex@ridewithalex.org",
    priceRange: "€€",
    image: `${SITE_URL}/en/opengraph-image`,
    logo: `${SITE_URL}/favicon.svg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "ул. Пирин 1 (пред гондолата)",
      addressLocality: "Банско",
      addressRegion: "Благоевград",
      postalCode: "2770",
      addressCountry: "BG",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 41.8367,
      longitude: 23.4822,
    },
    areaServed: [
      { "@type": "City", name: "Bansko" },
      { "@type": "AdministrativeArea", name: "Pirin Mountains" },
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "09:00",
      closes: "17:00",
    },
    sameAs: ["https://instagram.com/ridewithalex"],
    knowsLanguage: ["en", "bg"],
    makesOffer: {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Private snowboard lesson",
        serviceType: "Snowboard instruction",
      },
      priceCurrency: "EUR",
      price: "100",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "50",
        priceCurrency: "EUR",
        unitCode: "HUR",
      },
    },
  };
  return <JsonLd data={data} />;
}

type BreadcrumbItem = { name: string; href: string };

export function BreadcrumbListJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.href.startsWith("http") ? item.href : `${SITE_URL}${item.href}`,
    })),
  };
  return <JsonLd data={data} />;
}

type Faq = { question: string; answer: string };

export function FaqPageJsonLd({ items }: { items: Faq[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
  return <JsonLd data={data} />;
}

export function SnowboardServiceJsonLd({ locale }: { locale: string }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Snowboard lesson",
    provider: { "@id": `${SITE_URL}/#business` },
    areaServed: { "@type": "City", name: "Bansko" },
    availableLanguage: ["en", "bg"],
    offers: [
      {
        "@type": "Offer",
        name: "Private lesson",
        description:
          "One-on-one coaching for adults at any level, from beginners to advanced.",
        priceCurrency: "EUR",
        price: "100",
      },
      {
        "@type": "Offer",
        name: "Kids lesson",
        description:
          "Patient, safety-first coaching for children from age 6. Focus on balance, confidence, and fun.",
        priceCurrency: "EUR",
        price: "90",
      },
      {
        "@type": "Offer",
        name: "Group lesson",
        description:
          "Small groups of friends or family riding at a similar level. Lower cost per person without sacrificing attention.",
        priceCurrency: "EUR",
        price: "50",
      },
    ],
    url: `${SITE_URL}/${locale}/lessons`,
  };
  return <JsonLd data={data} />;
}

export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "RideWithAlex",
    description: "Private snowboard lessons in Bansko, Bulgaria",
    inLanguage: ["en", "bg"],
    publisher: { "@id": `${SITE_URL}/#business` },
  };
  return <JsonLd data={data} />;
}
