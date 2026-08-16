import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { html } from "@/content/contact";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name}. Email ${site.email} or send a message through the contact form.`,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact | ${site.name}`,
    description: `Get in touch with ${site.name}. Email ${site.email} or send a message through the contact form.`,
    url: "/contact",
  },
};

export default function ContactPage() {
  return <PageShell pageId="page-contact" html={html} />;
}
