import type { CSSProperties } from "react";
import {
  parseInternshipContent,
  isParsedInternshipDescriptionEmpty,
  splitWhyJoinItem,
  structureOverviewBlocks,
  type StructuredOverviewBlock,
} from "@/lib/internship-description";

const headingStyle: CSSProperties = {
  fontFamily: "'Space Grotesk',sans-serif",
  fontSize: "1rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  color: "#E5E7EB",
  margin: "2.2rem 0 1rem",
};

const paragraphStyle: CSSProperties = {
  fontFamily: "'Inter',sans-serif",
  fontSize: "0.92rem",
  color: "#D4DCE9",
  lineHeight: 1.75,
  marginBottom: "1rem",
};

const listItemStyle: CSSProperties = {
  display: "flex",
  gap: "0.7rem",
  alignItems: "flex-start",
  marginBottom: "0.55rem",
};

function Heading({ children }: { children: React.ReactNode }) {
  return <div style={headingStyle}>{children}</div>;
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {items.map((item, index) => (
        <li key={index} style={listItemStyle}>
          <span style={{ color: "#2962FF", fontSize: "0.6rem", lineHeight: 1.9, flex: "none" }}>
            ◆
          </span>
          <span
            style={{
              fontFamily: "'Inter',sans-serif",
              fontSize: "0.85rem",
              color: "#D4DCE9",
              lineHeight: 1.65,
            }}
          >
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

function OverviewBlocks({ blocks }: { blocks: StructuredOverviewBlock[] }) {
  return (
    <div>
      {blocks.map((block, index) => {
        switch (block.kind) {
          case "heading":
            return (
              <div
                key={index}
                style={{
                  fontFamily: "'Space Grotesk',sans-serif",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "#E5E7EB",
                  margin: "1.2rem 0 0.7rem",
                }}
              >
                {block.text}
              </div>
            );
          case "group":
            return (
              <div key={index} style={{ marginBottom: "1.5rem" }}>
                <div
                  style={{
                    fontFamily: "'Space Grotesk',sans-serif",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: "#E5E7EB",
                    marginBottom: "0.7rem",
                  }}
                >
                  {block.title}
                </div>
                {block.items.length > 0 ? <BulletList items={block.items} /> : null}
              </div>
            );
          case "bullets":
            return <BulletList key={index} items={block.items} />;
          case "paragraph":
            return (
              <p key={index} style={paragraphStyle}>
                {block.text}
              </p>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

export function InternshipSections({ description }: { description?: string }) {
  const parsed = parseInternshipContent(description);
  const useStructuredBody = description && !isParsedInternshipDescriptionEmpty(parsed);
  const showSectionHeadings =
    parsed.responsibilities.length > 0 ||
    parsed.qualifications.length > 0 ||
    parsed.whyJoinUs.length > 0;

  if (!useStructuredBody) {
    return description ? (
      <div className="whitespace-pre-wrap" style={paragraphStyle}>
        {description}
      </div>
    ) : null;
  }

  return (
    <div>
      {parsed.overview.length > 0 ? (
        <section>
          {showSectionHeadings ? <Heading>Overview</Heading> : null}
          <OverviewBlocks blocks={structureOverviewBlocks(parsed.overview)} />
        </section>
      ) : null}

      {parsed.responsibilities.length > 0 ? (
        <section>
          <Heading>Key Responsibilities</Heading>
          <BulletList items={parsed.responsibilities} />
        </section>
      ) : null}

      {parsed.qualifications.length > 0 ? (
        <section>
          <Heading>Qualifications and Skills</Heading>
          <BulletList items={parsed.qualifications} />
        </section>
      ) : null}

      {parsed.whyJoinUs.length > 0 ? (
        <section>
          <Heading>Why Join Us?</Heading>
          <div style={{ display: "grid", gap: 14, marginBottom: "2.4rem" }}>
            {parsed.whyJoinUs.map((item, index) => {
              const entry = splitWhyJoinItem(item);
              return (
                <div
                  key={index}
                  className="role-why"
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(148,163,184,0.35)",
                    borderRadius: 10,
                    padding: "1.1rem 1.3rem",
                  }}
                >
                  {entry.title ? (
                    <div
                      style={{
                        fontFamily: "'Space Grotesk',sans-serif",
                        fontSize: "0.9rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        color: "#E5E7EB",
                        marginBottom: "0.4rem",
                      }}
                    >
                      {entry.title.replace(/:$/, "")}
                    </div>
                  ) : null}
                  <p
                    style={{
                      fontFamily: "'Inter',sans-serif",
                      fontSize: "0.85rem",
                      color: "#D4DCE9",
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    {entry.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}
    </div>
  );
}
