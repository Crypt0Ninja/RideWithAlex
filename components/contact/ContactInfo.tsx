import { useTranslations } from "next-intl";

type Channel = {
  key: "phone" | "email" | "instagram";
  href: string;
  value: string;
  external: boolean;
};

const channels: Channel[] = [
  { key: "phone", href: "tel:+359885137471", value: "+359 88 513 7471", external: false },
  { key: "email", href: "mailto:alex@ridewithalex.org", value: "alex@ridewithalex.org", external: false },
  { key: "instagram", href: "https://instagram.com/ridewithalex", value: "@ridewithalex", external: true },
];

export function ContactInfo() {
  const t = useTranslations("contact.info");
  const tRoot = useTranslations("contact");

  return (
    <section className="px-6 md:px-10 py-24 md:py-32 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {channels.map(({ key, href, value, external }) => (
        <a
          key={key}
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="group bg-neutral-900 rounded-3xl p-8 border border-white/5 hover:border-white/20 transition-colors flex flex-col gap-4"
        >
          <p className="text-white/40 text-xs uppercase tracking-[0.3em]">
            {t(`${key}.label`)}
          </p>
          <p className="text-white text-2xl md:text-3xl font-medium lowercase tracking-tight">
            {value}
          </p>
          <p className="text-white/60 text-sm leading-relaxed lowercase mt-auto">
            {t(`${key}.hint`)}
          </p>
          <span className="text-white/40 group-hover:text-white/80 transition-colors text-xs uppercase tracking-[0.3em] mt-2">
            {external ? tRoot("open") : tRoot("tap")}
          </span>
        </a>
      ))}
    </section>
  );
}
