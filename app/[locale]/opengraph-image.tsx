import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "ridewithalex — private snowboard lessons in bansko";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function OpenGraphImage({ params }: Props) {
  const { locale } = await params;

  const tagline =
    locale === "bg"
      ? "частни уроци по сноуборд · банско"
      : "private snowboard lessons · bansko";

  return new ImageResponse(
    (
      <div
        style={{
          background: "#000",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
          }}
        >
          ridewithalex
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 128,
              fontWeight: 700,
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
            }}
          >
            <span>ride</span>
            <span style={{ color: "rgba(255,255,255,0.5)" }}>with</span>
            <span>alex</span>
          </div>
          <div
            style={{
              fontSize: 32,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            {tagline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "rgba(255,255,255,0.4)",
          }}
        >
          <div style={{ display: "flex" }}>ridewithalex.org</div>
          <div style={{ display: "flex" }}>{locale.toUpperCase()}</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
