import { Hero } from "@/components/hero/Hero";
import { SiteFooter } from "@/components/shared/SiteFooter";
import {
  LocalBusinessJsonLd,
  WebSiteJsonLd,
} from "@/components/seo/StructuredData";

export default function Home() {
  return (
    <>
      <LocalBusinessJsonLd />
      <WebSiteJsonLd />
      <Hero />
      <SiteFooter />
    </>
  );
}
