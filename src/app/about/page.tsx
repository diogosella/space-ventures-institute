import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { html } from "@/content/about";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Space Ventures Institute is a venture studio for space-curious builders. Advance your space career. Remote first, open to the world.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About Us | ${site.name}`,
    description:
      "Space Ventures Institute is a venture studio for space-curious builders. Advance your space career. Remote first, open to the world.",
    url: "/about",
  },
};

export default function AboutPage() {
  return <PageShell pageId="page-about" html={html} />;
}
