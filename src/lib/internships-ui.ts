import type { Internship } from "@/lib/strapi";

const statusPriority: Record<string, number> = {
  Open: 0,
  "Closing Soon": 1,
  Pending: 2,
  Closed: 3,
  Filled: 3,
};

export type SafeInternship = Internship & { title: string; slug: string };

export function sortInternships(list: Internship[]): SafeInternship[] {
  return [...list]
    .filter((item): item is SafeInternship => Boolean(item.title?.trim() && item.slug?.trim()))
    .sort((a, b) => {
      const ap = statusPriority[a.status] ?? 99;
      const bp = statusPriority[b.status] ?? 99;
      if (ap !== bp) return ap - bp;
      return a.title.localeCompare(b.title);
    });
}

export function formatInternshipLocation(location: string): string {
  if (location.trim().toLowerCase() === "remote") {
    return "On-Site / Remote";
  }
  return location;
}

export function statusAccent(status: string): boolean {
  return status === "Open" || status === "Closing Soon";
}
