import fs from "node:fs";

const html = fs.readFileSync("extracted/template.html", "utf8");

const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
const metas = [...html.matchAll(/<meta\s+([^>]+)>/gi)].map((m) => m[1]);
const links = [...html.matchAll(/<link\s+([^>]+)>/gi)].map((m) => m[1].slice(0, 200));
const scripts = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)].map((m) => ({
  attrs: m[1].trim().slice(0, 200),
  len: m[2].length,
  preview: m[2].slice(0, 300).replace(/\s+/g, " "),
}));
const headings = [...html.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => ({
  level: m[1],
  text: m[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().slice(0, 120),
}));
const sections = [...html.matchAll(/<(section|header|footer|nav|main|aside)([^>]*)>/gi)].map((m) => ({
  tag: m[1],
  attrs: m[2].replace(/\s+/g, " ").trim().slice(0, 180),
}));
const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
const classes = [...html.matchAll(/\sclass="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/));
const classCounts = {};
for (const c of classes) classCounts[c] = (classCounts[c] || 0) + 1;
const topClasses = Object.entries(classCounts).sort((a, b) => b[1] - a[1]).slice(0, 80);

const styleBlocks = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)];
const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]).filter((h) => !h.startsWith("data:") && !/^[0-9a-f-]{36}/.test(h));
const srcs = [...html.matchAll(/src="([^"]+)"/g)].map((m) => m[1].slice(0, 120));
const buttons = [...html.matchAll(/<(a|button)([^>]*)>([\s\S]*?)<\/\1>/gi)].map((m) => ({
  tag: m[1],
  attrs: m[2].replace(/\s+/g, " ").trim().slice(0, 140),
  text: m[3].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().slice(0, 80),
})).filter((b) => b.text || /href=/.test(b.attrs)).slice(0, 80);

console.log("=== TITLE ===");
console.log(title);
console.log("\n=== METAS ===");
metas.forEach((m) => console.log(m.slice(0, 200)));
console.log("\n=== LINKS ===");
links.forEach((m) => console.log(m));
console.log("\n=== SCRIPTS ===");
scripts.forEach((s) => console.log(JSON.stringify(s)));
console.log("\n=== SECTIONS ===");
sections.forEach((s) => console.log(`${s.tag} ${s.attrs}`));
console.log("\n=== IDS ===");
console.log(ids.join("\n"));
console.log("\n=== HEADINGS ===");
headings.forEach((h) => console.log(`h${h.level}: ${h.text}`));
console.log("\n=== TOP CLASSES ===");
topClasses.forEach(([c, n]) => console.log(`${n}\t${c}`));
console.log("\n=== STYLE BLOCKS ===");
styleBlocks.forEach((s, i) => console.log(`style ${i}: ${s[1].length} chars`));
console.log("\n=== HREFS ===");
[...new Set(hrefs)].forEach((h) => console.log(h));
console.log("\n=== SRCS ===");
srcs.forEach((s) => console.log(s));
console.log("\n=== BUTTONS/LINKS ===");
buttons.forEach((b) => console.log(`${b.tag} | ${b.text} | ${b.attrs}`));
console.log("\n=== HTML LENGTH ===", html.length);
