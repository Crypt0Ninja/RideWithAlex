import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RideWithAlex — private snowboard lessons in Bansko",
    short_name: "RideWithAlex",
    description:
      "Private snowboard lessons in Bansko, Bulgaria. Adults, kids, and groups. Book directly — no deposit.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    orientation: "portrait",
    lang: "en",
    categories: ["sports", "education", "travel"],
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
