import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const SRC = "C:\\Users\\rebec\\OneDrive\\Desktop\\index.html";
const OUT = path.resolve("extracted");

function extractScript(html, type) {
  const open = `<script type="${type}">`;
  const i = html.indexOf(open);
  if (i === -1) return null;
  const start = i + open.length;
  const end = html.indexOf("</script>", start);
  return html.slice(start, end).trim();
}

function extForMime(mime) {
  const map = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/svg+xml": ".svg",
    "image/x-icon": ".ico",
    "image/vnd.microsoft.icon": ".ico",
    "font/woff2": ".woff2",
    "font/woff": ".woff",
    "font/ttf": ".ttf",
    "font/otf": ".otf",
    "application/font-woff2": ".woff2",
    "application/font-woff": ".woff",
    "text/css": ".css",
    "text/html": ".html",
    "text/javascript": ".js",
    "application/javascript": ".js",
    "application/json": ".json",
  };
  return map[mime] || "";
}

fs.mkdirSync(OUT, { recursive: true });
const html = fs.readFileSync(SRC, "utf8");

const manifest = JSON.parse(extractScript(html, "__bundler/manifest"));
const template = JSON.parse(extractScript(html, "__bundler/template"));
const pageOrder = JSON.parse(extractScript(html, "__bundler/page_order") || "[]");
const extResources = JSON.parse(extractScript(html, "__bundler/ext_resources") || "[]");

const assetsDir = path.join(OUT, "assets");
fs.mkdirSync(assetsDir, { recursive: true });

const uuidToPath = {};
const summary = [];

for (const [uuid, entry] of Object.entries(manifest)) {
  let bytes = Buffer.from(entry.data, "base64");
  if (entry.compressed) bytes = zlib.gunzipSync(bytes);

  const isPage = pageOrder.includes(uuid);
  const ext = isPage ? ".html" : extForMime(entry.mime) || ".bin";
  const filename = `${uuid}${ext}`;
  const dest = isPage ? path.join(OUT, "pages", filename) : path.join(assetsDir, filename);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, bytes);

  const rel = path.relative(OUT, dest).replaceAll("\\", "/");
  uuidToPath[uuid] = rel;
  summary.push({
    uuid,
    mime: entry.mime,
    compressed: !!entry.compressed,
    bytes: bytes.length,
    page: isPage,
    path: rel,
  });
}

let resolved = template;
for (const [uuid, rel] of Object.entries(uuidToPath)) {
  resolved = resolved.split(uuid).join(`./${rel}`);
}

fs.writeFileSync(path.join(OUT, "template.html"), template);
fs.writeFileSync(path.join(OUT, "index.resolved.html"), resolved);
fs.writeFileSync(path.join(OUT, "manifest-summary.json"), JSON.stringify(summary, null, 2));
fs.writeFileSync(path.join(OUT, "ext-resources.json"), JSON.stringify(extResources, null, 2));
fs.writeFileSync(path.join(OUT, "page-order.json"), JSON.stringify(pageOrder, null, 2));
fs.writeFileSync(path.join(OUT, "uuid-map.json"), JSON.stringify(uuidToPath, null, 2));

console.log("assets:", summary.length);
console.log("pages:", pageOrder.length);
console.log("template chars:", template.length);
console.log("mimes:", [...new Set(summary.map((s) => s.mime))].join(", "));
for (const s of summary) {
  console.log(`${s.page ? "PAGE" : "ASSET"} ${s.mime} ${s.bytes} ${s.path}`);
}
