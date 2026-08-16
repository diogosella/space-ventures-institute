import fs from "node:fs";

const files = [
  "src/content/home.ts",
  "src/content/about.ts",
  "src/content/projects.ts",
  "src/content/journey.ts",
  "src/content/internships.ts",
  "src/content/contact.ts",
];
const srcs = new Set();
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  for (const match of text.matchAll(/src=\\?"([^\\"]+)/g)) srcs.add(match[1]);
}
for (const src of srcs) {
  if (src.startsWith("/")) {
    const disk = `public${src}`;
    console.log(fs.existsSync(disk) ? "OK" : "MISSING", src);
  } else {
    console.log("OTHER", src);
  }
}
