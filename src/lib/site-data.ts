import roles from "@/data/roles.json";

type LocalRole = {
  slug: string;
  mode?: string;
  title: string;
  blurb?: string;
  overview?: string[];
  resp?: string[];
  qual?: string[];
  why?: { h: string; b: string }[];
};

function toDescription(role: LocalRole): string | undefined {
  const parts: string[] = [];

  if (role.overview?.length) {
    parts.push("Overview", "", role.overview.join("\n\n"));
  }
  if (role.resp?.length) {
    parts.push("Key Responsibilities", "", role.resp.map((item) => `- ${item}`).join("\n"));
  }
  if (role.qual?.length) {
    parts.push("Qualifications and Skills", "", role.qual.map((item) => `- ${item}`).join("\n"));
  }
  if (role.why?.length) {
    parts.push(
      "Why Join Us?",
      "",
      role.why.map((item) => `${item.h}: ${item.b}`).join("\n\n"),
    );
  }

  const text = parts.join("\n\n").trim();
  return text || undefined;
}

/** Local fallback when Strapi is unconfigured, unreachable, or empty. */
export const internshipPositions = (roles as LocalRole[]).map((role, index) => ({
  id: index + 1,
  slug: role.slug,
  title: role.title,
  status: "Open",
  location: role.mode,
  summary: role.blurb,
  description: toDescription(role),
}));
