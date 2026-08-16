import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { html } from "@/content/projects";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "What Space Ventures Institute is building right now: FloBrain, MoodChanger, travel marketplace, humanoid robotics, space media, and more.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: `Projects | ${site.name}`,
    description:
      "What Space Ventures Institute is building right now: FloBrain, MoodChanger, travel marketplace, humanoid robotics, space media, and more.",
    url: "/projects",
  },
};

export default function ProjectsPage() {
  return <PageShell pageId="page-projects" html={html} />;
}
