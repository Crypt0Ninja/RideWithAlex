import { useTranslations } from "next-intl";
import { PageShell } from "@/components/shared/PageShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { GalleryUploadHint } from "@/components/gallery/GalleryUploadHint";
import { GalleryCta } from "@/components/gallery/GalleryCta";

export default function GalleryPage() {
  const t = useTranslations("gallery");

  return (
    <PageShell>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <GalleryGrid />
      <GalleryUploadHint />
      <GalleryCta />
    </PageShell>
  );
}
