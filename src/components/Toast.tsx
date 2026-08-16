"use client";

import { useEffect, useState } from "react";

export function Toast() {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onToast(event: Event) {
      const detail = (event as CustomEvent<string>).detail;
      setMessage(detail);
      setOpen(true);
      window.setTimeout(() => setOpen(false), 2600);
    }
    window.addEventListener("svi-toast", onToast);
    return () => window.removeEventListener("svi-toast", onToast);
  }, []);

  return (
    <div
      id="toast"
      style={{
        display: open ? "block" : "none",
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 400,
        background: "var(--blue)",
        color: "var(--white)",
        fontFamily: "var(--fm)",
        fontSize: "0.72rem",
        letterSpacing: "0.08em",
        padding: "0.8rem 1.4rem",
      }}
    >
      {message}
    </div>
  );
}

export function showToast(message: string) {
  window.dispatchEvent(new CustomEvent("svi-toast", { detail: message }));
}
