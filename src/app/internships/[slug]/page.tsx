import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HubSpotForm } from "@/components/hubspot-form";
import { InternshipSections } from "@/components/InternshipSections";
import { PageShell } from "@/components/PageShell";
import { resolveInternshipHubspotFormId } from "@/lib/hubspot";
import { formatInternshipLocation, statusAccent } from "@/lib/internships-ui";
import { site } from "@/lib/site";
import { getAllInternships, getInternship } from "@/lib/strapi";

export const revalidate = 60;
export const dynamicParams = true;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const internships = await getAllInternships();
  return internships.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const internship = await getInternship(slug);
  const title = internship?.title ?? "Internship";
  const description = internship?.summary ?? internship?.title ?? "Internship position.";

  return {
    title,
    description,
    alternates: { canonical: `/internships/${slug}` },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: `/internships/${slug}`,
    },
  };
}

function pill(text: string, accent: boolean) {
  return (
    <span
      style={{
        fontFamily: "'Inter',sans-serif",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: accent ? "#2962FF" : "#D4DCE9",
        border: `1px solid ${accent ? "rgba(41,98,255,0.45)" : "rgba(148,163,184,0.35)"}`,
        padding: "3px 10px",
        borderRadius: 2,
      }}
    >
      {text}
    </span>
  );
}

export default async function InternshipDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const internship = await getInternship(slug);
  if (!internship) notFound();

  const formId = resolveInternshipHubspotFormId(internship);
  const meta = [
    internship.location ? formatInternshipLocation(internship.location) : null,
    internship.company,
    [internship.duration, internship.schedule].filter(Boolean).join(" · ") || null,
  ].filter(Boolean) as string[];

  return (
    <PageShell pageId="page-internship-detail">
      <div id="internships-top" style={{ background: "#0F0F10" }}>
        <div style={{ padding: "5rem 0", background: "#0F0F10" }}>
          <div className="container">
            <article style={{ maxWidth: 820 }}>
              <Link
                href="/internships"
                style={{
                  fontFamily: "'Inter',sans-serif",
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#D4DCE9",
                  textDecoration: "none",
                  display: "inline-block",
                  marginBottom: "1.6rem",
                }}
              >
                ← All Internship Positions
              </Link>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "1.1rem" }}>
                {pill(internship.status || "Open", statusAccent(internship.status || "Open"))}
                {meta.map((item) => (
                  <span key={item}>{pill(item, false)}</span>
                ))}
              </div>

              <h1
                style={{
                  fontFamily: "'Space Grotesk',sans-serif",
                  fontSize: "2.4rem",
                  fontWeight: 700,
                  lineHeight: 1.08,
                  letterSpacing: "-0.01em",
                  textTransform: "uppercase",
                  color: "#F8FAFC",
                  marginBottom: "1.6rem",
                }}
              >
                {internship.title}
              </h1>

              {internship.summary ? (
                <p
                  style={{
                    fontFamily: "'Inter',sans-serif",
                    fontSize: "0.92rem",
                    color: "#D4DCE9",
                    lineHeight: 1.75,
                    marginBottom: "1rem",
                  }}
                >
                  {internship.summary}
                </p>
              ) : null}

              <InternshipSections description={internship.description} />

              <div style={{ marginTop: "2.8rem" }}>
                <div
                  style={{
                    fontFamily: "'Space Grotesk',sans-serif",
                    fontSize: "1rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    color: "#E5E7EB",
                    margin: "0 0 1rem",
                  }}
                >
                  Apply for this Position
                </div>
                {formId ? (
                  <HubSpotForm key={internship.slug} formId={formId} />
                ) : (
                  <p
                    style={{
                      fontFamily: "'Inter',sans-serif",
                      fontSize: "0.92rem",
                      color: "#D4DCE9",
                      lineHeight: 1.75,
                    }}
                  >
                    No application form is linked to this role yet.
                  </p>
                )}
              </div>

              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "2rem" }}>
                <Link
                  href="/internships"
                  style={{
                    fontFamily: "'Inter',sans-serif",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    background: "transparent",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.5)",
                    padding: "0.9rem 2rem",
                    borderRadius: 6,
                    letterSpacing: "0.03em",
                    textDecoration: "none",
                  }}
                >
                  All Positions
                </Link>
              </div>
            </article>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
