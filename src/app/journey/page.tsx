import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { html } from "@/content/journey";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Journey",
  description:
    "A visual journey through the Space Ventures Institute team evolution. From foundational work to future vision.",
  alternates: { canonical: "/journey" },
  openGraph: {
    title: `Our Journey | ${site.name}`,
    description:
      "A visual journey through the Space Ventures Institute team evolution. From foundational work to future vision.",
    url: "/journey",
  },
};

export default function JourneyPage() {
  return <PageShell pageId="page-journey" html={html} />;
}
