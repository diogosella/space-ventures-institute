"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { SocialLinks } from "@/components/SocialLinks";
import { projectLinks } from "@/lib/site";

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "0.9rem" }}>
              <Logo size={56} />
              <div
                style={{
                  fontFamily: "'Space Grotesk',sans-serif",
                  fontSize: "1rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                  color: "#E5E7EB",
                  lineHeight: 1.2,
                }}
              >
                <span className="footer-brand-name">Space Ventures Institute</span>{" "}
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 400,
                    textTransform: "none",
                    letterSpacing: 0,
                    color: "#6b7280",
                  }}
                >
                  | by FloLabs Innovations Group
                </span>
              </div>
            </div>
            <p>
              FloLabs Innovations Group.
              <br />
              <span style={{ whiteSpace: "nowrap" }}>Accelerating the Interstellar Economy.</span>
            </p>
            <div style={{ marginTop: "1.4rem" }}>
              <div
                style={{
                  fontFamily: "'Space Grotesk',sans-serif",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: "#94A3B8",
                  marginBottom: "0.35rem",
                }}
              >
                Newsletter
              </div>
              <div
                style={{
                  fontFamily: "'Inter',sans-serif",
                  fontSize: "0.72rem",
                  color: "#6b7280",
                  marginBottom: "0.65rem",
                }}
              >
                Receive the newest updates at:
              </div>
              <div style={{ display: "flex" }}>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email..."
                  style={{
                    flex: 1,
                    minWidth: 0,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid #2d3748",
                    borderRight: "none",
                    color: "#e5e7eb",
                    padding: "0.5rem 0.65rem",
                    fontFamily: "'Inter',sans-serif",
                    fontSize: "0.72rem",
                    outline: "none",
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setEmail("");
                    setSubscribed(true);
                  }}
                  style={{
                    background: "#2962FF",
                    border: "none",
                    color: "#ffffff",
                    padding: "0.5rem 0.7rem",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    lineHeight: 1,
                    whiteSpace: "nowrap",
                  }}
                >
                  {subscribed ? "✓" : "→"}
                </button>
              </div>
            </div>
            <div style={{ marginTop: "1.4rem" }}>
              <div
                style={{
                  fontFamily: "'Space Grotesk',sans-serif",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: "#94A3B8",
                  marginBottom: "0.65rem",
                }}
              >
                Social Media
              </div>
              <SocialLinks />
            </div>
          </div>
          <div className="footer-col">
            <h5>Navigation</h5>
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/#home-who-section">About Us</Link>
              </li>
              <li>
                <Link href="/projects">Projects</Link>
              </li>
              <li>
                <Link href="/#home-journey-section">Journey</Link>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Projects</h5>
            <ul>
              {projectLinks.map((project) => (
                <li key={project.name}>
                  <a href={project.href} target="_blank" rel="noopener noreferrer">
                    {project.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h5>Company</h5>
            <ul>
              <li>
                <Link href="/internships">Careers</Link>
              </li>
              <li>
                <Link href="/contact">Contact Us</Link>
              </li>
              <li>
                <a href="https://flolabsrd.notion.site/merch-background" target="_blank" rel="noopener noreferrer">
                  Merch Page
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-bottom-text" style={{ fontStyle: "italic", letterSpacing: "0.05em" }}>
            Live long and prosper.
          </span>
        </div>
      </div>
    </footer>
  );
}
