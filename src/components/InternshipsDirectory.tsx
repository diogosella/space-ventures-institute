"use client";

import { useEffect } from "react";
import roles from "@/data/roles.json";

type Role = {
  slug: string;
  mode: string;
  title: string;
  blurb: string;
  overviewTitle?: string;
  overview: string[];
  sectionsTitle?: string;
  sections?: { h: string; items: string[] }[];
  resp?: string[];
  qual?: string[];
  why?: { h: string; b: string }[];
  applyUrl?: string;
};

const PAGE = 9;

export function InternshipsDirectory() {
  useEffect(() => {
    const allRoles = roles as Role[];
    let shown = PAGE;
    let query = "";

    function list() {
      const term = query.trim().toLowerCase();
      return allRoles.filter(
        (role) =>
          !term ||
          role.title.toLowerCase().includes(term) ||
          role.blurb.toLowerCase().includes(term),
      );
    }

    function bullets(items: string[]) {
      return items
        .map(
          (item) =>
            `<li style="display:flex;gap:0.7rem;align-items:flex-start;margin-bottom:0.55rem"><span style="color:#2962FF;font-size:0.6rem;line-height:1.9;flex:none">&#9670;</span><span style="font-family:'Inter',sans-serif;font-size:0.85rem;color:#D4DCE9;line-height:1.65">${item}</span></li>`,
        )
        .join("");
    }

    function pill(text: string, accent: boolean) {
      return `<span style="font-family:'Inter',sans-serif;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${accent ? "#2962FF" : "#D4DCE9"};border:1px solid ${accent ? "rgba(41,98,255,0.45)" : "rgba(148,163,184,0.35)"};padding:3px 10px;border-radius:2px">${text}</span>`;
    }

    function card(role: Role) {
      return `<div class="role-card" data-slug="${role.slug}" style="background:transparent;border:1px solid rgba(148,163,184,0.35);border-radius:10px;padding:1.2rem 1.4rem;cursor:pointer">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.7rem"><div style="font-family:'Inter',sans-serif;font-size:11px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;color:#D4DCE9">Internships</div></div>
        <div style="font-family:'Space Grotesk',sans-serif;font-size:0.95rem;font-weight:700;color:#E5E7EB;text-transform:uppercase;margin-bottom:0.4rem">${role.title}</div>
        <p style="font-family:'Inter',sans-serif;font-size:0.78rem;color:#D4DCE9;line-height:1.55">${role.blurb}</p>
        <div style="font-family:'Inter',sans-serif;font-size:11px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:#FFFFFF;margin-top:0.8rem">More Details &#8250;</div></div>`;
    }

    function heading(text: string) {
      return `<div style="font-family:'Space Grotesk',sans-serif;font-size:1rem;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;color:#E5E7EB;margin:2.2rem 0 1rem">${text}</div>`;
    }

    function closeRole() {
      const detail = document.getElementById("role-detail");
      const listEl = document.getElementById("roles-list");
      const extra = document.getElementById("internships-extra");
      if (detail) detail.style.display = "none";
      if (listEl) listEl.style.display = "block";
      if (extra) extra.style.display = "block";
    }

    function openRole(slug: string) {
      const role = allRoles.find((item) => item.slug === slug);
      if (!role) return;
      let markup = `<div style="max-width:820px">
        <div data-action="close-role" style="font-family:'Inter',sans-serif;font-size:12px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:#D4DCE9;cursor:pointer;margin-bottom:1.6rem">&#8592; All Internship Positions</div>
        <div style="display:flex;gap:8px;margin-bottom:1.1rem">${pill(role.mode, false)}</div>
        <h2 style="font-family:'Space Grotesk',sans-serif;font-size:2.4rem;font-weight:700;line-height:1.08;letter-spacing:-0.01em;text-transform:uppercase;color:#F8FAFC;margin-bottom:1.6rem">${role.title}</h2>
        ${heading(role.overviewTitle || "Overview")}
        ${role.overview.map((p) => `<p style="font-family:'Inter',sans-serif;font-size:0.92rem;color:#D4DCE9;line-height:1.75;margin-bottom:1rem">${p}</p>`).join("")}`;

      if (role.sections?.length) {
        markup += heading(role.sectionsTitle || "What you'll work on");
        markup += role.sections
          .map(
            (section) =>
              `<div style="margin-bottom:1.5rem"><div style="font-family:'Space Grotesk',sans-serif;font-size:0.9rem;font-weight:700;text-transform:uppercase;color:#E5E7EB;margin-bottom:0.7rem">${section.h}</div><ul style="list-style:none;padding:0;margin:0">${bullets(section.items)}</ul></div>`,
          )
          .join("");
      }
      if (role.resp?.length) markup += heading("Key Responsibilities") + `<ul style="list-style:none;padding:0;margin:0">${bullets(role.resp)}</ul>`;
      if (role.qual?.length) markup += heading("Qualifications and Skills") + `<ul style="list-style:none;padding:0;margin:0">${bullets(role.qual)}</ul>`;
      if (role.why?.length) {
        markup +=
          heading("Why Join Us?") +
          `<div style="display:grid;gap:14px;margin-bottom:2.4rem">${role.why
            .map(
              (item) =>
                `<div class="role-why" style="background:transparent;border:1px solid rgba(148,163,184,0.35);border-radius:10px;padding:1.1rem 1.3rem"><div style="font-family:'Space Grotesk',sans-serif;font-size:0.9rem;font-weight:700;text-transform:uppercase;color:#E5E7EB;margin-bottom:0.4rem">${item.h}</div><p style="font-family:'Inter',sans-serif;font-size:0.85rem;color:#D4DCE9;line-height:1.65;margin:0">${item.b}</p></div>`,
            )
            .join("")}</div>`;
      }
      markup += `<div style="display:flex;gap:1rem;flex-wrap:wrap"><a href="${role.applyUrl || "https://www.hephaestus.international/internships"}" target="_blank" rel="noopener noreferrer" style="font-family:'Inter',sans-serif;font-size:0.9rem;font-weight:700;background:#2962FF;color:#fff;border:none;padding:0.9rem 2rem;border-radius:6px;cursor:pointer;letter-spacing:0.03em;text-decoration:none">Apply for this Position &#8594;</a>
        <button data-action="close-role" style="font-family:'Inter',sans-serif;font-size:0.9rem;font-weight:600;background:transparent;color:#fff;border:1px solid rgba(255,255,255,0.5);padding:0.9rem 2rem;border-radius:6px;cursor:pointer;letter-spacing:0.03em">All Positions</button></div></div>`;

      const detail = document.getElementById("role-detail");
      const listEl = document.getElementById("roles-list");
      const extra = document.getElementById("internships-extra");
      if (!detail) return;
      detail.innerHTML = markup;
      if (listEl) listEl.style.display = "none";
      detail.style.display = "block";
      if (extra) extra.style.display = "none";
      window.scrollTo({ top: detail.getBoundingClientRect().top + window.scrollY - 110, behavior: "smooth" });
    }

    function render() {
      const matches = list();
      const grid = document.getElementById("roles-grid");
      if (!grid) return;
      grid.innerHTML = matches.slice(0, shown).map(card).join("");
      const wrap = document.getElementById("roles-more-wrap");
      const button = document.getElementById("roles-more");
      const rest = matches.length - shown;
      if (wrap && button) {
        if (rest > 0) {
          wrap.style.display = "block";
          button.textContent = `Load Full Directory [${rest} Remaining]`;
          button.setAttribute("data-mode", "more");
        } else if (matches.length > PAGE) {
          wrap.style.display = "block";
          button.textContent = "See Less";
          button.setAttribute("data-mode", "less");
        } else {
          wrap.style.display = "none";
        }
      }
      grid.querySelectorAll<HTMLElement>(".role-card").forEach((el) => {
        el.addEventListener("click", () => openRole(el.getAttribute("data-slug") || ""));
      });
    }

    const more = document.getElementById("roles-more");
    const filter = document.getElementById("roles-filter") as HTMLInputElement | null;
    const onMore = () => {
      if (more?.getAttribute("data-mode") === "less") {
        shown = PAGE;
        render();
        const grid = document.getElementById("roles-grid");
        if (grid) window.scrollTo({ top: grid.getBoundingClientRect().top + window.scrollY - 140, behavior: "smooth" });
      } else {
        shown = allRoles.length;
        render();
      }
    };
    const onFilter = () => {
      query = filter?.value || "";
      shown = PAGE;
      render();
    };
    const onClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest("[data-action='close-role']");
      if (target) closeRole();
    };

    more?.addEventListener("click", onMore);
    filter?.addEventListener("input", onFilter);
    document.addEventListener("click", onClick);
    render();

    return () => {
      more?.removeEventListener("click", onMore);
      filter?.removeEventListener("input", onFilter);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
