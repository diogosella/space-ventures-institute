"use client";

import { useEffect, useState } from "react";
import { html } from "@/content/modal";

export function ApplyModal() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    function open(event: Event) {
      const role = (event as CustomEvent<string>).detail || "Open Role";
      const overlay = document.getElementById("modal-overlay");
      const title = document.getElementById("modal-role-title");
      const job = document.getElementById("modal-job-title") as HTMLInputElement | null;
      const form = document.getElementById("modal-form");
      const success = document.getElementById("modal-success");
      if (title) title.textContent = `Apply, ${role}`;
      if (job) job.value = role;
      if (form) form.style.display = "block";
      if (success) success.style.display = "none";
      if (overlay) overlay.style.display = "flex";
      document.body.style.overflow = "hidden";
    }

    function close() {
      const overlay = document.getElementById("modal-overlay");
      if (overlay) overlay.style.display = "none";
      document.body.style.overflow = "";
    }

    window.addEventListener("svi-apply", open);
    window.addEventListener("svi-close-modal", close);
    return () => {
      window.removeEventListener("svi-apply", open);
      window.removeEventListener("svi-close-modal", close);
    };
  }, []);

  if (!mounted) return null;

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
