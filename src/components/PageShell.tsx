import { ApplyModal } from "@/components/ApplyModal";
import { HtmlIsland } from "@/components/HtmlIsland";
import { InternshipsDirectory } from "@/components/InternshipsDirectory";
import { SiteEffects } from "@/components/SiteEffects";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Toast } from "@/components/Toast";

type PageShellProps = {
  pageId: string;
  html: string;
  internships?: boolean;
};

export function PageShell({ pageId, html, internships }: PageShellProps) {
  return (
    <>
      <SiteHeader />
      <div id={pageId} className="page active">
        <HtmlIsland html={html} />
      </div>
      <SiteFooter />
      <ApplyModal />
      <Toast />
      <SiteEffects />
      {internships ? <InternshipsDirectory /> : null}
    </>
  );
}
