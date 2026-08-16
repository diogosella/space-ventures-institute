import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), "public/logo.svg"));
  const logoSrc = `data:image/svg+xml;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px 80px",
          background: "linear-gradient(160deg, #0B0E11 0%, #121826 55%, #0B0E11 100%)",
          color: "#F8FAFC",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 78% 22%, rgba(41,98,255,0.28) 0%, transparent 42%), radial-gradient(circle at 18% 80%, rgba(103,142,172,0.18) 0%, transparent 36%)",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 28, marginBottom: 36 }}>
          <img src={logoSrc} width={112} height={112} alt="" />
          <div
            style={{
              fontSize: 28,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#93C5FD",
              fontWeight: 600,
            }}
          >
            {site.parent}
          </div>
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
            maxWidth: 980,
          }}
        >
          Space Ventures Institute
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 28,
            color: "#D4DCE9",
            maxWidth: 820,
          }}
        >
          {site.tagline}
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 22,
            color: "#678EAC",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {site.url.replace("https://", "")}
        </div>
      </div>
    ),
    size,
  );
}
