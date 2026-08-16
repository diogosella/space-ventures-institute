import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { html } from "@/content/internships";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Internships",
  description:
    "Apply to your passion. Join FloLabs Innovations Group and Space Ventures Institute to architect the future of human-machine symbiosis.",
  alternates: { canonical: "/internships" },
  openGraph: {
    title: `Internships | ${site.name}`,
    description:
      "Apply to your passion. Join FloLabs Innovations Group and Space Ventures Institute to architect the future of human-machine symbiosis.",
    url: "/internships",
  },
};

export default function InternshipsPage() {
  return <PageShell pageId="page-internships" html={html} internships />;
}
