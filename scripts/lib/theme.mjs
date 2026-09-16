import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));
export const path = (p) => root + p;

// Colours from the website (amir-sarfaraz-resume.vercel.app)
export const C = {
  ink: "#0b0b0c",
  inkSoft: "#141416",
  bar: "#17171a",
  line: "#2a2a2f",
  paper: "#efede8",
  paperDim: "#c9c7c1",
  muted: "#8b8a85",
  faint: "#55544f",
  accent: "#ff4d2e",
  accentSoft: "#ff8466",
};

export const WIDTH = 860;
export const MONO = "GeistMono, ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace";
export const DISPLAY = "UnboundedDisplay, 'Arial Black', Arial, sans-serif";

const b64 = (file) => readFileSync(path(`fonts/${file}`), "utf8").trim();
export function fontFaces({ display = false } = {}) {
  let css =
    `@font-face{font-family:GeistMono;font-weight:400;src:url(data:font/woff2;base64,${b64("geist-mono-400.b64")}) format("woff2")}` +
    `@font-face{font-family:GeistMono;font-weight:600;src:url(data:font/woff2;base64,${b64("geist-mono-600.b64")}) format("woff2")}`;
  if (display) css += `@font-face{font-family:UnboundedDisplay;font-weight:700;src:url(data:font/woff2;base64,${b64("unbounded-700.b64")}) format("woff2")}`;
  return css;
}

export const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Geist Mono advance width is 0.6em
export const monoWidth = (text, size) => [...String(text)].length * size * 0.6;

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
export const mix = (a, b, t) => "#" + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, "0")).join("");
const lum = (h) => {
  const [r, g, b] = hex(h).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
// brand colours that disappear on the dark background are lifted towards paper
export function readable(color) {
  const l = lum(color);
  if (l < 0.02) return C.paper;
  const contrast = (l + 0.05) / (lum(C.ink) + 0.05);
  return contrast < 3.2 ? mix(color, C.paper, 0.45) : color;
}

export const svgOpen = (w, h, label) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}">`;
