import { C, WIDTH, MONO, esc, fontFaces, svgOpen } from "../lib/theme.mjs";
import { windowFrame, prompt, baseCss, BAR } from "../lib/window.mjs";

// GitHub greens -> the website's orange ink
const RECOLOR = [
  [/#000000/gi, C.ink],
  [/#aaaaaa/gi, C.muted],
  [/#0e4429/gi, "#3d1a12"],
  [/#006d32/gi, "#7a2c18"],
  [/#26a641/gi, "#c63d22"],
  [/#39d353/gi, C.accent],
  [/#161b22/gi, "#17171a"],
];

export function renderContributions({ gameSvg, total, asOf }) {
  const W = WIDTH, pad = 22;
  const open = gameSvg.match(/<svg[^>]*>/)[0];
  const gw = Number(open.match(/width="([\d.]+)"/)[1]);
  const gh = Number(open.match(/height="([\d.]+)"/)[1]);
  let inner = gameSvg.slice(open.length, gameSvg.lastIndexOf("</svg>")).replace(/<desc>[\s\S]*?<\/desc>/, "");
  for (const [from, to] of RECOLOR) inner = inner.replace(from, to);
  inner = inner.replace(/<text /g, `<text font-family="${MONO}" `);

  const gx = pad, gy = BAR + 46, gwOut = W - pad * 2;
  const ghOut = (gh * gwOut) / gw;
  const footY = gy + ghOut + 30;
  const H = Math.ceil(footY + 20);
  const summary = total > 0
    ? `<tspan fill="${C.paper}">${total}</tspan> contributions in the last year`
    : "contribution graph of the last year";
  return `${svgOpen(W, H, "Contribution graph of the last year played as Galaga")}
  <style>${fontFaces()}${baseCss}</style>
  ${windowFrame({ w: W, h: H, title: "amir@sarfaraz: ~/contributions — galaga" })}
  ${prompt({ x: pad, y: BAR + 26, cmd: "./galaga --contributions --last-year" })}
  <svg x="${gx}" y="${gy}" width="${gwOut}" height="${ghOut.toFixed(1)}" viewBox="0 0 ${gw} ${gh}" preserveAspectRatio="xMidYMid meet">${inner}</svg>
  <text x="${pad}" y="${footY}" font-family="${MONO}" font-size="12.5" fill="${C.muted}"><tspan fill="${C.accent}">▸ </tspan>${summary}<tspan fill="${C.faint}">${asOf ? ` · as of ${esc(asOf)}` : ""}</tspan></text>
</svg>`;
}
