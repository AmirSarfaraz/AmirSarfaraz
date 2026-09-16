// One-off (not run by CI). Needs `npm i subset-font @fontsource/geist-mono @fontsource/unbounded simple-icons` locally.
// One-off: subset the OFL fonts used inside the SVGs and store them as base64 (committed to the profile repo).
import subsetFont from "subset-font";
import { readFileSync, writeFileSync } from "node:fs";

const ascii = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join("");
const extra = "─│┌┐└┘├┤┬┴┼━•·…→←↑↓▸▹●○■□▪▫█▓▒░✓✗×—–’“”°%";
const mono = ascii + extra;

async function subset(src, text, out) {
  const buf = readFileSync(src);
  const sub = await subsetFont(buf, text, { targetFormat: "woff2" });
  writeFileSync(out, sub.toString("base64"));
  console.log(out, buf.length, "->", sub.length, "bytes");
}

const fs = "node_modules/@fontsource";
await subset(`${fs}/geist-mono/files/geist-mono-latin-400-normal.woff2`, mono, "fonts/geist-mono-400.b64");
await subset(`${fs}/geist-mono/files/geist-mono-latin-600-normal.woff2`, mono, "fonts/geist-mono-600.b64");
await subset(`${fs}/unbounded/files/unbounded-latin-700-normal.woff2`, "AmirhosenSafzARFZ .", "fonts/unbounded-700.b64");
