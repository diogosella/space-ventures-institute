"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";

const navItems = [
  { id: "nav-journey", href: "/#home-journey-section", label: "Journey" },
  { id: "nav-about", href: "/#home-who-section", label: "About Us" },
  { id: "nav-projects", href: "/#home-projects-section", label: "Projects" },
];

export function SiteHeader() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = window.localStorage.getItem("svi-theme");
    if (saved === "light") {
      document.body.classList.add("light");
      setTheme("light");
    }
  }, []);

  function toggleTheme() {
    const next = document.body.classList.contains("light") ? "dark" : "light";
    document.body.classList.toggle("light", next === "light");
    window.localStorage.setItem("svi-theme", next);
    setTheme(next);
  }

  return (
    <nav>
      <div className="nav-inner">
        <Link className="nav-logo" href="/">
          <div className="logo-anim-wrap">
            <Logo size={36} className="logo-img" priority />
          </div>
          <span className="nav-logo-text">Space Ventures Institute</span>
        </Link>
        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.id}>
              <a id={item.id} href={item.href}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="nav-spacer" />
        <Link className="nav-apply" href="/internships" style={{ textDecoration: "none" }}>
          Apply Now
        </Link>
        <button
          id="theme-toggle"
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          style={{
            background: "transparent",
            border: "1px solid rgba(103,142,172,0.35)",
            width: 36,
            height: 36,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            borderRadius: 6,
            fontSize: 15,
            lineHeight: 1,
            marginLeft: "0.6rem",
            flexShrink: 0,
            transition: "border-color 0.2s,background 0.2s",
          }}
        >
          <span id="theme-icon">{theme === "light" ? "☀" : "☾"}</span>
        </button>
      </div>
    </nav>
  );
}
