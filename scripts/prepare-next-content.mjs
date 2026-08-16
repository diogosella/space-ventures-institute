import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PARTS = path.join(ROOT, "extracted", "parts");
const ASSETS = path.join(ROOT, "extracted", "assets");

const IMAGE_MAP = {
  "d694ba1b-bb0e-4e7d-9077-54d2876c7b94": "earth-from-space.jpg",
  "92d989c3-8fec-4e9b-bf58-a3636a34eefc": "journey-nebula.jpg",
  "ed71a82c-db23-4935-8250-f171e4b51b55": "logo-flobrain.png",
  "572952e6-fba6-46dc-8a1c-19a566c6c870": "logo-moodchanger.png",
  "77134e53-ee1b-4d19-a87d-842eefaa577a": "logo-mark.png",
  "5f1b3b7e-5cab-4436-9ac6-3d1ac205c316": "logo-tarrl.png",
  "e152178b-2e29-4957-8599-78e2f8c688f8": "astronauts-mars.jpg",
  "2bd34d20-8e91-467a-8c3c-ded0be568196": "moon.jpg",
  "d2289b67-7026-43bb-a6ab-f5e2dbff43f4": "about-texture.jpg",
  "3d2f2070-7903-4c9d-b69a-24b236bce5f7": "earth-orbit.jpg",
  "44137737-d114-4245-8107-91d323ad031a": "venture-studio-badge.jpg",
  "7e2078bc-b41f-4a56-8059-fcf4c7cda8fa": "astronaut-spacewalk.jpg",
  "bdaa112a-9248-4e6d-a775-a41356582385": "messier-88.jpg",
  "ff11839e-bdc2-4f47-8517-afd7f5542785": "iss-cupola.jpg",
  "3d1ceffe-4a80-43b8-8879-c84240c9ed07": "astronaut-in-space.jpg",
  "334bbecc-82f5-46ef-b3d4-88d57eb89809": "earth-from-orbit.jpg",
};

const dirs = [
  "public/images",
  "public/fonts",
  "public/icons",
  "src/content",
  "src/data",
];
for (const d of dirs) fs.mkdirSync(path.join(ROOT, d), { recursive: true });

for (const [uuid, name] of Object.entries(IMAGE_MAP)) {
  const ext = path.extname(name);
  const src = path.join(ASSETS, uuid + ext);
  fs.copyFileSync(src, path.join(ROOT, "public/images", name));
}

for (const file of fs.readdirSync(ASSETS)) {
  if (file.endsWith(".woff2")) {
    fs.copyFileSync(path.join(ASSETS, file), path.join(ROOT, "public/fonts", file));
  }
}

const logoMatch = fs
  .readFileSync(path.join(PARTS, "nav.html"), "utf8")
  .match(/src="(data:image\/svg\+xml,[^"]+)"/);
if (!logoMatch) throw new Error("logo data URI not found");
const logoSvg = decodeURIComponent(logoMatch[1].replace("data:image/svg+xml,", ""));
fs.writeFileSync(path.join(ROOT, "public/logo.svg"), logoSvg);
fs.writeFileSync(path.join(ROOT, "public/icons/logo.svg"), logoSvg);
fs.copyFileSync(path.join(ROOT, "public/logo.svg"), path.join(ROOT, "src/app/icon.svg"));

let css = fs.readFileSync(path.join(PARTS, "all.css"), "utf8");
css = css.replace(/src:\s*url\("([0-9a-f-]+)"\)/gi, 'src: url("/fonts/$1.woff2")');
css = css.replace(/\.page\{display:none;padding-top:60px\}/, ".page{display:block;padding-top:60px}");
css = css.replace(/\.page\.active\{display:block\}/, ".page.active{display:block}");
fs.writeFileSync(path.join(ROOT, "src/app/svi.css"), css);

const rolesJs = fs.readFileSync(
  path.join(ASSETS, "c65a7a0d-1171-45a8-b782-0b541f575e5c.js"),
  "utf8",
);
const rolesJson = rolesJs.replace(/^window\.SVI_ROLES=/, "").replace(/;?\s*$/, "");
fs.writeFileSync(path.join(ROOT, "src/data/roles.json"), rolesJson);

function remapAssets(html) {
  let out = html;
  for (const [uuid, name] of Object.entries(IMAGE_MAP)) {
    out = out.split(uuid).join(`/images/${name}`);
  }
  out = out.replace(/src="data:image\/svg\+xml,[^"]+"/g, 'src="/logo.svg"');
  return out;
}

function stripFooter(html) {
  return html.replace(/<footer[\s\S]*?<\/footer>/gi, "");
}

function convertHandlers(html) {
  return html
    .replace(/onclick="showPage\('internships'\)"/g, 'data-nav="/internships"')
    .replace(/onclick="showPage\('contact'\)"/g, 'data-nav="/contact"')
    .replace(/onclick="showPage\('projects'\)"/g, 'data-nav="/projects"')
    .replace(/onclick="showPage\('about'\)"/g, 'data-nav="/about"')
    .replace(/onclick="showPage\('journey'\)"/g, 'data-nav="/journey"')
    .replace(/onclick="showPage\('home'\)"/g, 'data-nav="/"')
    .replace(
      /onclick="showPage\('home'\);setTimeout\(function\(\)\{document\.getElementById\('([^']+)'\)\.scrollIntoView\(\{behavior:'smooth'\}\)\},300\)"/g,
      'data-nav="/#$1"',
    )
    .replace(/onclick="showToast\('([^']+)'\)"/g, 'data-toast="$1"')
    .replace(/onclick="openApplyModal\('([^']+)'\)"/g, 'data-apply="$1"')
    .replace(/onclick="submitContact\(\)"/g, 'data-action="contact"')
    .replace(/onclick="submitApp\(\)"/g, 'data-action="submit-app"')
    .replace(/onclick="closeModal\(\)"/g, 'data-action="close-modal"')
    .replace(/onclick="closeModalOutside\(event\)"/g, 'data-action="close-modal-outside"')
    .replace(
      /onclick="this\.previousElementSibling\.value='';this\.textContent='✓'"/g,
      'data-action="newsletter"',
    )
    .replace(
      /onclick="document\.getElementById\('([^']+)'\)\.scrollBy\(\{left:(-?\d+),behavior:'smooth'\}\)"/g,
      'data-scroll-target="$1" data-scroll-left="$2"',
    )
    .replace(/onmouseover="([^"]*)"/g, 'data-mouseover="$1"')
    .replace(/onmouseout="([^"]*)"/g, 'data-mouseout="$1"');
}

function toModule(name, html) {
  const processed = convertHandlers(remapAssets(stripFooter(html))).trim();
  const body = processed
    .replace(/^<div id="page-[^"]+" class="page(?: active)?"[^>]*>/, "")
    .replace(/<\/div>\s*$/, "")
    .trim();
  const file = `export const html = ${JSON.stringify(body)};\n`;
  fs.writeFileSync(path.join(ROOT, "src/content", `${name}.ts`), file);
  console.log(name, body.length);
}

toModule("home", fs.readFileSync(path.join(PARTS, "page-home.html"), "utf8"));
toModule("about", fs.readFileSync(path.join(PARTS, "page-about.html"), "utf8"));
toModule("projects", fs.readFileSync(path.join(PARTS, "page-projects.html"), "utf8"));
toModule("journey", fs.readFileSync(path.join(PARTS, "page-journey.html"), "utf8"));
toModule("internships", fs.readFileSync(path.join(PARTS, "page-internships.html"), "utf8"));
toModule("contact", fs.readFileSync(path.join(PARTS, "page-contact.html"), "utf8"));

const modal = convertHandlers(remapAssets(fs.readFileSync(path.join(PARTS, "modal-overlay.html"), "utf8")));
fs.writeFileSync(
  path.join(ROOT, "src/content/modal.ts"),
  `export const html = ${JSON.stringify(modal)};\n`,
);

console.log("prepared");
