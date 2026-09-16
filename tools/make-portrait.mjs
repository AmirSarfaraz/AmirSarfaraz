// One-off (not run by CI): turns a background-removed photo (src/cutout.png, not committed) into data/portrait.json.
// Needs `npm i sharp` locally. Used settings: EDGE=0.45 CONTRAST=1.5 OUTLINE=1 node tools/make-portrait.mjs data/portrait.json
import sharp from "sharp";
import { writeFileSync } from "node:fs";

const cols = Number(process.env.COLS ?? 110), rows = Number(process.env.ROWS ?? 68);
const out = process.argv[2] ?? "repo/data/portrait.json";
const RAMP = " .:-=+*#%@";
const src = "src/cutout.png";
const { width, height } = await sharp(src).metadata();
const rgba = await sharp(src).ensureAlpha().raw().toBuffer();
let minX = width, minY = height, maxX = 0;
for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) if (rgba[(y * width + x) * 4 + 3] > 40) { minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); }
const top = Math.max(0, minY - 16);
const cropH = Math.round(height * Number(process.env.BOTTOM ?? 0.8)) - top;
const cropW = Math.round(cropH * (cols / rows) * 0.5);
const cx = Number(process.env.CX ?? Math.round((minX + maxX) / 2) + 10);
const left = Math.max(0, Math.min(width - cropW, cx - Math.round(cropW / 2)));
const region = { left, top, width: Math.min(cropW, width - left), height: cropH };

const W2 = cols * 2, H2 = rows * 2;
const greyFull = await sharp(src).extract(region).flatten({ background: "#000" }).greyscale().clahe({ width: 40, height: 40, maxSlope: 3 }).png().toBuffer();
const g2 = await sharp(greyFull).resize(W2, H2, { kernel: "lanczos3", fit: "fill" }).greyscale().raw().toBuffer();
const a2 = await sharp(src).extract(region).extractChannel("alpha").resize(W2, H2, { fit: "fill" }).raw().toBuffer();

// tone statistics inside the subject
const inside = [];
for (let i = 0; i < W2 * H2; i++) if (a2[i] > 160) inside.push(g2[i]);
inside.sort((a, b) => a - b);
const pct = (q) => inside[Math.floor(q * (inside.length - 1))];
const p5 = pct(0.04), p95 = pct(0.97);
const K = Number(process.env.CONTRAST ?? 1.3), G = Number(process.env.GAMMA ?? 1.15), EDGE = Number(process.env.EDGE ?? 0.34);

const at = (buf, x, y) => buf[Math.max(0, Math.min(H2 - 1, y)) * W2 + Math.max(0, Math.min(W2 - 1, x))];
const lines = [], levels = [], kinds = [];
for (let r = 0; r < rows; r++) {
  let line = ""; const lv = [], kd = [];
  for (let c = 0; c < cols; c++) {
    const x = c * 2, y = r * 2;
    const alpha = (a2[y * W2 + x] + a2[y * W2 + x + 1] + a2[(y + 1) * W2 + x] + a2[(y + 1) * W2 + x + 1]) / 4 / 255;
    if (alpha < 0.4) { line += " "; lv.push(0); kd.push(0); continue; }
    const L = (at(g2, x, y) + at(g2, x + 1, y) + at(g2, x, y + 1) + at(g2, x + 1, y + 1)) / 4;
    let v = (L - p5) / Math.max(1, p95 - p5);
    v = Math.min(1, Math.max(0, 0.5 + (v - 0.5) * K));
    v = Math.pow(v, G);
    // Sobel on the 2x grid, centred on the cell
    const gx = (at(g2, x + 2, y - 1) + 2 * at(g2, x + 2, y) + at(g2, x + 2, y + 1)) - (at(g2, x - 1, y - 1) + 2 * at(g2, x - 1, y) + at(g2, x - 1, y + 1));
    const gy = (at(g2, x - 1, y + 2) + 2 * at(g2, x, y + 2) + at(g2, x + 1, y + 2)) - (at(g2, x - 1, y - 1) + 2 * at(g2, x, y - 1) + at(g2, x + 1, y - 1));
    const mag = Math.hypot(gx, gy) / (4 * 255);
    let ch, kind = 1;
    if (mag > EDGE && v < 0.85) {
      // glyph follows the edge direction (perpendicular to the gradient); cells are 1:2
      const ang = (Math.atan2(gy, gx * 2) * 180) / Math.PI;
      const a = ((ang % 180) + 180) % 180;
      ch = a < 22.5 || a >= 157.5 ? "|" : a < 67.5 ? "/" : a < 112.5 ? "-" : "\\";
      if (ch === "/" || ch === "\\") ch = ch === "/" ? "\\" : "/";
      kind = 2;
    } else {
      const idx = Math.round(v * (RAMP.length - 1));
      ch = RAMP[idx];
      if (ch === " ") { ch = (r + c) % 2 === 0 ? "." : " "; kind = 4; }   // dark clothes: faint dotted texture
    }
    // silhouette outline: a cell inside the subject next to the background
    if (process.env.OUTLINE) {
      const outside = (xx, yy) => at(a2, xx, yy) < 100;
      if (outside(x - 2, y) || outside(x + 3, y) || outside(x, y - 2) || outside(x, y + 3)) {
        const gxa = at(a2, x + 2, y) - at(a2, x - 1, y), gya = at(a2, x, y + 2) - at(a2, x, y - 1);
        const ang = ((((Math.atan2(gya, gxa * 2) * 180) / Math.PI) % 180) + 180) % 180;
        ch = ang < 22.5 || ang >= 157.5 ? "|" : ang < 67.5 ? "\\" : ang < 112.5 ? "-" : "/";
        kind = 3;
      }
    }
    line += ch; lv.push(Number(v.toFixed(3))); kd.push(ch === " " ? 0 : kind);
  }
  lines.push(line); levels.push(lv); kinds.push(kd);
}
writeFileSync(out, JSON.stringify({ cols, rows, lines, levels, kinds }));
console.log("written", out, { region, p5, p95 });
