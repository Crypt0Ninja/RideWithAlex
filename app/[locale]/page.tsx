import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("home");
  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-3xl font-medium tracking-tight lowercase">
        {t("title")}
      </h1>
    </main>
  );
}
