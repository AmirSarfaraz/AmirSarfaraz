import { C, WIDTH, MONO, DISPLAY, fontFaces, svgOpen } from "../lib/theme.mjs";
import { prompt, baseCss } from "../lib/window.mjs";

const bit = (i, j) => ((i * 2654435761) ^ (j * 40503)) >>> 7 & 1;

export function renderHeader() {
  const W = WIDTH, H = 270;
  // binary smoke on the right, like the cursor trail on the website
  let binary = "";
  for (let col = 0; col < 14; col++) {
    const x = 640 + col * 15;
    const chars = Array.from({ length: 24 }, (_, j) => bit(col + 1, j + 3)).join("\n");
    const lines = chars.split("\n").map((ch, j) => `<tspan x="${x}" dy="${j ? 15 : 0}">${ch}</tspan>`).join("");
    const dur = (7 + (col % 5) * 1.3).toFixed(1);
    binary += `<text y="0" font-family="${MONO}" font-size="12" fill="${col % 4 === 1 ? C.accent : C.faint}">${lines}<animateTransform attributeName="transform" type="translate" from="0 ${-60 - (col % 3) * 20}" to="0 ${-420}" dur="${dur}s" repeatCount="indefinite"/></text>`;
  }
  return `${svgOpen(W, H, "Amir Sarfaraz — Back-End .NET Developer")}
  <style>${fontFaces({ display: true })}${baseCss}
    .outline{fill:${C.ink};paint-order:stroke;stroke:${C.paper};stroke-width:2.6;stroke-linejoin:round;stroke-dasharray:900;stroke-dashoffset:900;animation:draw 2.2s cubic-bezier(.6,.1,.2,1) .2s forwards}
    @keyframes draw{to{stroke-dashoffset:0}}
  </style>
  <defs>
    <clipPath id="frame"><rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="14"/></clipPath>
    <linearGradient id="fadeR" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="${C.ink}" stop-opacity="1"/><stop offset=".35" stop-color="${C.ink}" stop-opacity="0"/></linearGradient>
    <linearGradient id="fadeV" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${C.ink}" stop-opacity=".9"/><stop offset=".25" stop-color="${C.ink}" stop-opacity="0"/><stop offset=".75" stop-color="${C.ink}" stop-opacity="0"/><stop offset="1" stop-color="${C.ink}" stop-opacity=".95"/></linearGradient>
    <clipPath id="ink"><rect x="0" y="${H}" width="${W}" height="0">
      <animate attributeName="y" from="${H - 40}" to="60" begin="1.4s" dur="1.6s" fill="freeze" calcMode="spline" keySplines=".5 0 .2 1"/>
      <animate attributeName="height" from="0" to="${H}" begin="1.4s" dur="1.6s" fill="freeze" calcMode="spline" keySplines=".5 0 .2 1"/>
    </rect></clipPath>
  </defs>
  <g clip-path="url(#frame)">
    <rect width="${W}" height="${H}" fill="${C.ink}"/>
    <g opacity=".85">${binary}</g>
    <rect x="600" width="${W - 600}" height="${H}" fill="url(#fadeR)"/>
    <rect x="600" width="${W - 600}" height="${H}" fill="url(#fadeV)"/>
  </g>
  <rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="14" fill="none" stroke="${C.line}"/>
  ${prompt({ x: 34, y: 42, cmd: "./hello --world", size: 13, cursor: true })}
  <g font-family="${DISPLAY}" font-weight="700">
    <text x="30" y="120" font-size="54" class="outline">Amir</text>
    <text x="30" y="205" font-size="98" class="outline">Sarfaraz</text>
    <g clip-path="url(#ink)" fill="${C.accent}">
      <text x="30" y="120" font-size="54">Amir</text>
      <text x="30" y="205" font-size="98">Sarfaraz</text>
    </g>
  </g>
  <text x="34" y="243" font-family="${MONO}" font-size="13" fill="${C.paperDim}" class="fade" style="animation-delay:2.4s">Back-End .NET Developer <tspan fill="${C.faint}">—</tspan> data-heavy systems: ERP, payments &amp; AI services</text>
</svg>`;
}
