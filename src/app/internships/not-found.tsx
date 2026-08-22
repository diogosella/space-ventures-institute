import Link from "next/link";
import { PageShell } from "@/components/PageShell";

export default function InternshipsNotFound() {
  return (
    <PageShell pageId="page-internships-not-found">
      <div style={{ background: "#0F0F10", minHeight: "70vh", padding: "7rem 0" }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <h1
            style={{
              fontFamily: "'Space Grotesk',sans-serif",
              fontSize: "clamp(2.5rem,5vw,4rem)",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              textTransform: "uppercase",
              color: "#F8FAFC",
              marginBottom: "1.2rem",
            }}
          >
            No internships available.
          </h1>
          <Link
            href="/"
            className="internships-not-found-home"
            style={{
              display: "inline-block",
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
            Return Home
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
