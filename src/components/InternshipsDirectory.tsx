"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Internship } from "@/lib/strapi";
import { formatInternshipLocation, statusAccent } from "@/lib/internships-ui";

const PAGE = 9;

type InternshipsDirectoryProps = {
  internships: Internship[];
};

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

export function InternshipsDirectory({ internships }: InternshipsDirectoryProps) {
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(PAGE);

  const matches = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return internships;
    return internships.filter((item) => {
      const haystack = [item.title, item.summary, item.location, item.company, item.status]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [internships, query]);

  const visible = matches.slice(0, shown);
  const rest = matches.length - shown;

  return (
    <div id="roles-list">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <h2 className="sec-title">Open Internships</h2>
        <div
          style={{
            background: "transparent",
            border: "1px solid rgba(148,163,184,0.35)",
            borderRadius: 6,
            padding: "0 1rem",
            height: 40,
            display: "flex",
            alignItems: "center",
            gap: 8,
            minWidth: 200,
          }}
        >
          <input
            id="roles-filter"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setShown(PAGE);
            }}
            placeholder="Filter Positions"
            style={{
              flex: 1,
              minWidth: 0,
              background: "transparent",
              border: "none",
              outline: "none",
              fontFamily: "'Inter',sans-serif",
              fontSize: "0.82rem",
              color: "#D4DCE9",
            }}
          />
        </div>
      </div>

      {matches.length === 0 ? (
        <p
          style={{
            fontFamily: "'Inter',sans-serif",
            fontSize: "0.92rem",
            color: "#D4DCE9",
            marginBottom: "2rem",
          }}
        >
          No internships available at the moment.
        </p>
      ) : (
        <div id="roles-grid" className="internships-grid">
          {visible.map((item) => (
            <Link
              key={String(item.id)}
              href={`/internships/${item.slug}`}
              className="role-card"
              style={{
                background: "transparent",
                border: "1px solid rgba(148,163,184,0.35)",
                borderRadius: 10,
                padding: "1.2rem 1.4rem",
                textDecoration: "none",
                display: "block",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "0.7rem",
                  gap: 8,
                }}
              >
                {pill(item.status || "Open", statusAccent(item.status || "Open"))}
                {item.location ? (
                  <span
                    style={{
                      fontFamily: "'Inter',sans-serif",
                      fontSize: 11,
                      fontWeight: 500,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#D4DCE9",
                      textAlign: "right",
                    }}
                  >
                    {formatInternshipLocation(item.location)}
                  </span>
                ) : null}
              </div>
              <div
                style={{
                  fontFamily: "'Space Grotesk',sans-serif",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "#E5E7EB",
                  textTransform: "uppercase",
                  marginBottom: "0.4rem",
                }}
              >
                {item.title}
              </div>
              {item.summary ? (
                <p
                  style={{
                    fontFamily: "'Inter',sans-serif",
                    fontSize: "0.78rem",
                    color: "#D4DCE9",
                    lineHeight: 1.55,
                  }}
                >
                  {item.summary}
                </p>
              ) : null}
              <div
                style={{
                  fontFamily: "'Inter',sans-serif",
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#FFFFFF",
                  marginTop: "0.8rem",
                }}
              >
                More Details ›
              </div>
            </Link>
          ))}
        </div>
      )}

      {matches.length > PAGE ? (
        <div id="roles-more-wrap" style={{ textAlign: "center", padding: "1rem 0" }}>
          <button
            id="roles-more"
            type="button"
            onClick={() => {
              if (rest > 0) setShown(matches.length);
              else setShown(PAGE);
            }}
            style={{
              fontFamily: "'Inter',sans-serif",
              fontSize: 13,
              fontWeight: 500,
              background: "transparent",
              color: "#D4DCE9",
              border: "1px solid #1f2937",
              padding: "10px 20px",
              cursor: "pointer",
              borderRadius: 6,
              transition: "all 0.2s",
            }}
          >
            {rest > 0 ? `Load Full Directory [${rest} Remaining]` : "See Less"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
