"use client";

import Script from "next/script";
import { useEffect, useId, useRef, useState } from "react";
import { HUBSPOT_PORTAL_ID, HUBSPOT_REGION } from "@/lib/hubspot";

type HubSpotFormOptions = {
  portalId: string;
  formId: string;
  region: string;
  target: string;
  cssClass?: string;
};

type HubSpotFormsApi = {
  forms: {
    create: (options: HubSpotFormOptions) => void;
  };
};

declare global {
  interface Window {
    hbspt?: HubSpotFormsApi;
  }
}

type HubSpotFormProps = {
  formId: string;
};

export function HubSpotForm({ formId }: HubSpotFormProps) {
  const targetId = useId().replace(/:/g, "");
  const [scriptReady, setScriptReady] = useState(
    () => typeof window !== "undefined" && Boolean(window.hbspt?.forms),
  );
  const activeFormId = useRef<string | null>(null);

  useEffect(() => {
    if (!scriptReady || !formId || !window.hbspt?.forms) return;

    const target = document.getElementById(targetId);
    if (!target) return;

    const shouldCreate =
      activeFormId.current !== formId || target.querySelector("form.hs-form") === null;

    if (!shouldCreate) return;

    target.replaceChildren();
    window.hbspt.forms.create({
      portalId: HUBSPOT_PORTAL_ID,
      formId,
      region: HUBSPOT_REGION,
      target: `#${targetId}`,
      cssClass: "hubspot-application-form-embed",
    });
    activeFormId.current = formId;
  }, [formId, scriptReady, targetId]);

  return (
    <>
      {!scriptReady ? (
        <Script
          src="https://js.hsforms.net/forms/embed/v2.js"
          strategy="lazyOnload"
          onLoad={() => setScriptReady(true)}
        />
      ) : null}
      <div className="hubspot-form-shell">
        <div id={targetId} className="hubspot-form" aria-live="polite" />
      </div>
    </>
  );
}
