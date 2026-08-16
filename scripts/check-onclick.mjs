import fs from "node:fs";

for (const name of ["home", "about", "projects", "journey", "internships", "contact", "modal"]) {
  const s = fs.readFileSync(`src/content/${name}.ts`, "utf8");
  const clicks = [...s.matchAll(/onclick=/g)];
  const srcs = [...s.matchAll(/src=\\?"([^\\"]+)/g)].map((m) => m[1]);
  console.log(name, "onclick", clicks.length, "srcs", [...new Set(srcs)]);
}
