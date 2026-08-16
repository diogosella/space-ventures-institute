import fs from "node:fs";
import path from "node:path";

const html = fs.readFileSync("extracted/template.html", "utf8");
const out = "extracted/parts";
fs.mkdirSync(out, { recursive: true });

const styles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]);
fs.writeFileSync(path.join(out, "all.css"), styles.join("\n\n/* ===== next style block ===== */\n\n"));

const scripts = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)]
  .filter((m) => !m[1].includes("src="))
  .map((m, i) => {
    const name = `script-${String(i).padStart(2, "0")}.js`;
    fs.writeFileSync(path.join(out, name), m[2]);
    return { name, len: m[2].length, preview: m[2].slice(0, 120).replace(/\s+/g, " ") };
  });

function sliceById(id) {
  const re = new RegExp(`<[^>]+\\sid="${id}"[^>]*>`);
  const m = html.match(re);
  if (!m) return null;
  const start = m.index;
  const tag = m[0].match(/^<(\w+)/)[1];
  let i = start + m[0].length;
  let depth = 1;
  while (i < html.length && depth > 0) {
    const nextOpen = html.indexOf(`<${tag}`, i);
    const nextClose = html.indexOf(`</${tag}>`, i);
    if (nextClose === -1) break;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      i = nextOpen + tag.length + 1;
    } else {
      depth--;
      i = nextClose + tag.length + 3;
    }
  }
  return html.slice(start, i);
}

const ids = [
  "page-home",
  "page-about",
  "page-projects",
  "page-journey",
  "page-internships",
  "page-contact",
  "modal-overlay",
  "toast",
];

const navMatch = html.match(/<nav[\s\S]*?<\/nav>/);
fs.writeFileSync(path.join(out, "nav.html"), navMatch ? navMatch[0] : "MISSING");

for (const id of ids) {
  const chunk = sliceById(id);
  fs.writeFileSync(path.join(out, `${id}.html`), chunk || `MISSING ${id}`);
  console.log(id, chunk ? chunk.length : "MISSING");
}

const firstFooter = html.match(/<footer[\s\S]*?<\/footer>/);
fs.writeFileSync(path.join(out, "footer.html"), firstFooter ? firstFooter[0] : "MISSING");
console.log("nav", navMatch ? navMatch[0].length : "MISSING");
console.log("footer", firstFooter ? firstFooter[0].length : "MISSING");
console.log("css", styles.reduce((a, s) => a + s.length, 0));
console.log("scripts", JSON.stringify(scripts, null, 2));

const families = [...html.matchAll(/font-family:\s*['"]?([^;'"]+)/gi)].map((m) => m[1].trim());
const famCounts = {};
for (const f of families) famCounts[f] = (famCounts[f] || 0) + 1;
console.log("fonts", famCounts);
