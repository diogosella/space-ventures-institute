import fs from "node:fs";

const s = fs.readFileSync("src/content/home.ts", "utf8");
for (const m of s.matchAll(/onclick=\\?"([^\\"]+)/g)) {
  console.log(m[1]);
}
console.log("--- files ---");
import { readdirSync, statSync } from "node:fs";
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = `${dir}/${name}`;
    const st = statSync(p);
    if (st.isDirectory()) walk(p);
    else console.log(p, st.size);
  }
}
walk("public");
