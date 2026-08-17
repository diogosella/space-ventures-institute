import type { Metadata } from "next";
import { HtmlIsland } from "@/components/HtmlIsland";
import { InternshipsDirectory } from "@/components/InternshipsDirectory";
import { PageShell } from "@/components/PageShell";
import { html as extraHtml } from "@/content/internships-extra";
import { sortInternships } from "@/lib/internships-ui";
import { site } from "@/lib/site";
import { getAllInternships } from "@/lib/strapi";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Internships",
  description:
    "Apply to your passion. Join FloLabs Innovations Group and Space Ventures Institute to architect the future of human-machine symbiosis.",
  alternates: { canonical: "/internships" },
  openGraph: {
    title: `Internships | ${site.name}`,
    description:
      "Apply to your passion. Join FloLabs Innovations Group and Space Ventures Institute to architect the future of human-machine symbiosis.",
    url: "/internships",
  },
};

export default async function InternshipsPage() {
  const internships = sortInternships(await getAllInternships());

  return (
    <PageShell pageId="page-internships">
      <div id="internships-top" style={{ background: "#0F0F10" }}>
        <div
          style={{
            background: "linear-gradient(135deg,#0F0F10 55%,rgba(59,130,246,0.08) 100%)",
            borderBottom: "1px solid #1f2937",
          }}
        >
          <div className="container" style={{ paddingTop: "5rem", paddingBottom: "4rem" }}>
            <h1
              style={{
                fontFamily: "'Space Grotesk',sans-serif",
                fontSize: 64,
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
                textTransform: "uppercase",
                color: "#F8FAFC",
                marginBottom: "1rem",
              }}
            >
              Internship
              <br />
              <span style={{ color: "#2962FF" }}>Positions</span>
            </h1>
            <p
              style={{
                fontFamily: "'Inter',sans-serif",
                fontSize: "0.94rem",
                fontWeight: 400,
                color: "#D4DCE9",
                maxWidth: 480,
                lineHeight: 1.65,
                marginBottom: "2rem",
              }}
            >
              Apply to your passion. Join the FloLabs Innovations Group to architect the future of
              human-machine symbiosis.
            </p>
          </div>
        </div>

        <div style={{ padding: "5rem 0", background: "#0F0F10" }}>
          <div className="container">
            <InternshipsDirectory internships={internships} />
          </div>
        </div>

        <HtmlIsland html={extraHtml} />
      </div>
    </PageShell>
  );
}
