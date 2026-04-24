import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { PageShell } from "@/components/shared/PageShell";
import { ScrollVideoSection } from "@/components/shared/ScrollVideoSection";
import { LessonTypeCard } from "@/components/lessons/LessonTypeCard";
import { LessonsCta } from "@/components/lessons/LessonsCta";

type MetadataProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "lessons" });
  return {
    title: t("title"),
    description: t("subtitle"),
    openGraph: { title: t("title"), description: t("subtitle") },
  };
}

export default function LessonsPage() {
  const t = useTranslations("lessons");

  const lessonTypes = [
    {
      key: "private" as const,
      duration: t("private.duration"),
      level: t("private.level"),
    },
    {
      key: "kids" as const,
      duration: t("kids.duration"),
      level: t("kids.level"),
    },
    {
      key: "group" as const,
      duration: t("group.duration"),
      level: t("group.level"),
    },
  ];

  return (
    <PageShell>
      <ScrollVideoSection
        frameCount={90}
        framePathPrefix="/videos/lessons/frame-"
      >
        <section className="min-h-screen flex items-center justify-center px-6 md:px-10">
          <div className="flex flex-col gap-6 md:gap-10 max-w-4xl text-center">
            <p className="text-white/60 text-xs md:text-sm uppercase tracking-[0.4em]">
              {t("eyebrow")}
            </p>
            <h1 className="hero-title text-white font-medium text-[clamp(56px,10vw,140px)] leading-[0.95] tracking-tight">
              {t("title")}
            </h1>
            <p className="text-white/80 text-base md:text-lg leading-relaxed lowercase max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
          </div>
        </section>

        <section className="px-6 md:px-10 py-24 md:py-32 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {lessonTypes.map(({ key, duration, level }) => (
            <LessonTypeCard
              key={key}
              title={t(`${key}.title`)}
              description={t(`${key}.description`)}
              includes={[
                t(`${key}.includes.0`),
                t(`${key}.includes.1`),
                t(`${key}.includes.2`),
              ]}
              duration={duration}
              level={level}
            />
          ))}
        </section>

        <LessonsCta />
      </ScrollVideoSection>
    </PageShell>
  );
}
