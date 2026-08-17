import type { ReactNode } from "react";
import { ApplyModal } from "@/components/ApplyModal";
import { HtmlIsland } from "@/components/HtmlIsland";
import { SiteEffects } from "@/components/SiteEffects";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Toast } from "@/components/Toast";

type PageShellProps = {
  pageId: string;
  html?: string;
  children?: ReactNode;
};

export function PageShell({ pageId, html, children }: PageShellProps) {
  return (
    <>
      <SiteHeader />
      <div id={pageId} className="page active">
        {html ? <HtmlIsland html={html} /> : null}
        {children}
      </div>
      <SiteFooter />
      <ApplyModal />
      <Toast />
      <SiteEffects />
    </>
  );
}
