import { useTranslations } from "next-intl";
import { PageShell } from "@/components/shared/PageShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { LessonTypeCard } from "@/components/lessons/LessonTypeCard";
import { LessonsCta } from "@/components/lessons/LessonsCta";

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
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <section className="px-6 md:px-10 pb-24 md:pb-32 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl">
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
    </PageShell>
  );
}
