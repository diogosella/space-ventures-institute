"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { showToast } from "@/components/Toast";

function runInline(code: string, el: HTMLElement) {
  try {
    new Function(code).call(el);
  } catch {
    /* ignore invalid hover snippets */
  }
}

export function SiteEffects() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node: Node | null;
    while ((node = walker.nextNode())) {
      if (node.nodeValue && /[—–]/.test(node.nodeValue)) {
        node.nodeValue = node.nodeValue
          .replace(/\s*[—–]\s*/g, ", ")
          .replace(/,\s*,/g, ",")
          .replace(/\s+,/g, ",");
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 80);
    }
  }, [pathname]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const nav = target.closest<HTMLElement>("[data-nav]");
      if (nav) {
        event.preventDefault();
        router.push(nav.getAttribute("data-nav") || "/");
        return;
      }
      const toast = target.closest<HTMLElement>("[data-toast]");
      if (toast) {
        showToast(toast.getAttribute("data-toast") || "");
        return;
      }
      const apply = target.closest<HTMLElement>("[data-apply]");
      if (apply) {
        window.dispatchEvent(new CustomEvent("svi-apply", { detail: apply.getAttribute("data-apply") || "" }));
        return;
      }
      const scroller = target.closest<HTMLElement>("[data-scroll-target]");
      if (scroller) {
        const el = document.getElementById(scroller.getAttribute("data-scroll-target") || "");
        const left = Number(scroller.getAttribute("data-scroll-left") || 0);
        el?.scrollBy({ left, behavior: "smooth" });
        return;
      }
      const action = target.closest<HTMLElement>("[data-action]");
      if (!action) return;
      const kind = action.getAttribute("data-action");
      if (kind === "contact") {
        const first = (document.getElementById("cf-first") as HTMLInputElement | null)?.value.trim();
        const email = (document.getElementById("cf-email") as HTMLInputElement | null)?.value.trim();
        if (!first || !email) {
          alert("Please fill in your name and email.");
          return;
        }
        const body = document.getElementById("contact-form-body");
        const success = document.getElementById("contact-success");
        if (body) body.style.display = "none";
        if (success) success.style.display = "block";
      }
      if (kind === "submit-app") {
        const form = document.getElementById("modal-form");
        const success = document.getElementById("modal-success");
        if (form) form.style.display = "none";
        if (success) success.style.display = "block";
      }
      if (kind === "close-modal") {
        window.dispatchEvent(new Event("svi-close-modal"));
      }
      if (kind === "close-modal-outside" && event.target === action) {
        window.dispatchEvent(new Event("svi-close-modal"));
      }
      if (kind === "newsletter") {
        const prev = action.previousElementSibling;
        if (prev instanceof HTMLInputElement) prev.value = "";
        action.textContent = "✓";
      }
    }

    function onOver(event: Event) {
      const el = (event.target as HTMLElement).closest<HTMLElement>("[data-mouseover]");
      if (el) runInline(el.getAttribute("data-mouseover") || "", el);
    }
    function onOut(event: Event) {
      const el = (event.target as HTMLElement).closest<HTMLElement>("[data-mouseout]");
      if (el) runInline(el.getAttribute("data-mouseout") || "", el);
    }

    document.addEventListener("click", onClick);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, [router]);

  useEffect(() => {
    if (document.getElementById("star-canvas")) return;
    const canvas = document.createElement("canvas");
    canvas.id = "star-canvas";
    canvas.style.cssText =
      "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.5";
    document.body.prepend(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.2 + 0.2,
      speed: Math.random() * 0.15 + 0.02,
      opacity: Math.random() * 0.7 + 0.1,
      pulse: Math.random() * Math.PI * 2,
    }));
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);
    let frame = 0;
    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        star.pulse += 0.012;
        const opacity = star.opacity * (0.6 + 0.4 * Math.sin(star.pulse));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(103,142,172,${opacity})`;
        ctx.fill();
        star.y -= star.speed;
        if (star.y < -2) {
          star.y = canvas.height + 2;
          star.x = Math.random() * canvas.width;
        }
      });
      frame = requestAnimationFrame(draw);
    }
    draw();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      canvas.remove();
    };
  }, []);

  useEffect(() => {
    if (document.getElementById("scroll-progress")) return;
    const prog = document.createElement("div");
    prog.id = "scroll-progress";
    document.body.prepend(prog);
    const onScroll = () => {
      const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      prog.style.width = `${Number.isFinite(pct) ? pct : 0}%`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      prog.remove();
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" },
    );

    document
      .querySelectorAll(
        ".section,.who-section,.sec-underline,.loop-grid,.who-grid,#projects-grid > div,#page-home figure,h2.h2,h1.h1",
      )
      .forEach((el) => {
        el.classList.add("reveal");
        observer.observe(el);
      });

    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    const sections = [
      { id: "home-who-section", nav: "nav-about" },
      { id: "home-projects-section", nav: "nav-projects" },
      { id: "home-journey-section", nav: "nav-journey" },
    ];
    const onScroll = () => {
      const mid = window.scrollY + window.innerHeight / 2;
      sections.forEach(({ id, nav }) => {
        const el = document.getElementById(id);
        const navEl = document.getElementById(nav);
        if (!el || !navEl) return;
        const { top, bottom } = el.getBoundingClientRect();
        const absTop = top + window.scrollY;
        const absBot = bottom + window.scrollY;
        if (mid >= absTop && mid <= absBot) {
          document.querySelectorAll(".nav-links a").forEach((a) => a.classList.remove("active"));
          navEl.classList.add("active");
        }
      });
      if (window.scrollY < 80) {
        document.querySelectorAll(".nav-links a").forEach((a) => a.classList.remove("active"));
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return null;
}
