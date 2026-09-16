import { readFileSync } from "node:fs";
import { C, WIDTH, MONO, esc, mix, fontFaces, svgOpen, path } from "../lib/theme.mjs";
import { windowFrame, prompt, baseCss, BAR } from "../lib/window.mjs";
import { neofetch, CAREER_START } from "../data/profile.mjs";

export function uptime(now = new Date()) {
  const start = new Date(CAREER_START);
  const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  const y = Math.floor(months / 12), m = months % 12;
  return [y && `${y} yr${y > 1 ? "s" : ""}`, m && `${m} mo${m > 1 ? "s" : ""}`].filter(Boolean).join(" ");
}

// deterministic 0/1 noise for the "decoding" layer
const bit = (r, c) => ((r * 73856093) ^ (c * 19349663)) & 1;

function portrait({ x, y, width }) {
  const p = JSON.parse(readFileSync(path("data/portrait.json"), "utf8"));
  const charW = width / p.cols;
  const lineH = charW * 2;
  const fontSize = (lineH * 0.92).toFixed(2);
  let ascii = "", binary = "";
  p.lines.forEach((line, r) => {
    let spans = "", cur = null, buf = "", bits = "";
    const flush = () => { if (buf) spans += cur ? `<tspan fill="${cur}">${esc(buf)}</tspan>` : esc(buf); buf = ""; };
    [...line].forEach((ch, c) => {
      bits += ch === " " ? " " : String(bit(r, c));
      if (ch === " ") { buf += ch; return; }
      const kind = p.kinds[r][c];
      const col = kind === 3 ? C.accent : kind === 4 ? "#3d3b38" : mix("#4a4845", C.paper, Math.round(p.levels[r][c] * 9) / 9);
      if (col !== cur) { flush(); cur = col; }
      buf += ch;
    });
    flush();
    const ty = (y + (r + 0.8) * lineH).toFixed(2);
    const delay = (0.35 + r * 0.03).toFixed(2);
    const attrs = `x="${x}" y="${ty}" textLength="${(p.cols * charW).toFixed(2)}" lengthAdjust="spacingAndGlyphs" xml:space="preserve"`;
    binary += `<text class="bin" style="animation-delay:${(delay - 0.18).toFixed(2)}s" ${attrs}>${bits}</text>`;
    ascii += `<text class="px" style="animation-delay:${delay}s" ${attrs}>${spans}</text>`;
  });
  const height = p.rows * lineH;
  const scanEnd = (0.35 + p.rows * 0.03).toFixed(2);
  return {
    height,
    svg: `<g font-family="${MONO}" font-size="${fontSize}">
      <g fill="${C.accent}">${binary}</g>
      <g fill="${C.paper}">${ascii}</g>
      <rect x="${x - 6}" y="${y}" width="${width + 12}" height="2" fill="${C.accent}" opacity="0">
        <animate attributeName="y" from="${y}" to="${(y + height).toFixed(1)}" begin="0.35s" dur="${(scanEnd - 0.35).toFixed(2)}s" fill="freeze"/>
        <animate attributeName="opacity" values="0;.9;.9;0" keyTimes="0;.05;.9;1" begin="0.35s" dur="${(scanEnd - 0.35).toFixed(2)}s" fill="freeze"/>
      </rect>
    </g>`,
  };
}

export function renderWhoami(stats = {}) {
  const W = WIDTH;
  const pad = 22;
  const top = BAR + 44;
  const pw = 372;
  const por = portrait({ x: pad, y: top, width: pw });
  const H = Math.ceil(top + por.height + 24);

  const rx = pad + pw + 28;
  const keyW = 13 * 7.2;
  let y = top + 14;
  let rows = `<text x="${rx}" y="${y}" font-family="${MONO}" font-size="15" font-weight="600" class="type" style="animation-delay:.5s"><tspan fill="${C.accent}">amir</tspan><tspan fill="${C.muted}">@</tspan><tspan fill="${C.accent}">sarfaraz</tspan></text>`;
  y += 14;
  rows += `<text x="${rx}" y="${y}" font-family="${MONO}" font-size="12" fill="${C.faint}" class="type" style="animation-delay:.65s">${"-".repeat(30)}</text>`;
  y += 26;

  const line = (k, v, i, valueColor = C.paper) => {
    const delay = (0.8 + i * 0.11).toFixed(2);
    const out = `<g class="type" style="animation-delay:${delay}s"><text x="${rx}" y="${y}" font-family="${MONO}" font-size="12" font-weight="600" fill="${C.accent}">${esc(k)}</text><text x="${rx + 11 * 7.2}" y="${y}" font-family="${MONO}" font-size="12" fill="${C.faint}">:</text><text x="${rx + keyW}" y="${y}" font-family="${MONO}" font-size="12" fill="${valueColor}">${esc(v)}</text></g>`;
    y += 22;
    return out;
  };

  let i = 0;
  for (const [k, v] of neofetch) rows += line(k, v.replace("{uptime}", uptime()), i++);
  y += 10;
  if (stats.contributions > 0) rows += line("Activity", `${stats.contributions} contributions in the last year`, i++, C.paperDim);
  rows += line("Repos", "mostly private: company & client code", i++, C.paperDim);
  rows += line("Refreshed", `${stats.refreshed ?? new Date().toISOString().slice(0, 10)} by GitHub Actions`, i++, C.muted);

  y += 6;
  const swatches = [C.ink, "#2a2a2f", C.faint, C.muted, C.paper, C.accent];
  const swDelay = (0.8 + i * 0.11).toFixed(2);
  rows += `<g class="fade" style="animation-delay:${swDelay}s">${swatches.map((s, j) => `<rect x="${rx + j * 30}" y="${y - 12}" width="26" height="14" rx="2" fill="${s}" stroke="${C.line}"/>`).join("")}</g>`;

  return `${svgOpen(W, H, "whoami: ASCII portrait of Amirhossein Sarfaraz and a neofetch-style profile card")}
  <style>${fontFaces()}${baseCss}
    .px{animation:px .35s ease-out both}
    .bin{opacity:0;animation:bin .5s ease-out both}
    @keyframes px{from{opacity:0}to{opacity:1}}
    @keyframes bin{0%{opacity:0}30%{opacity:.55}100%{opacity:0}}
  </style>
  ${windowFrame({ w: W, h: H, title: "amir@sarfaraz: ~ — whoami" })}
  ${prompt({ x: pad, y: BAR + 26, cmd: "whoami --verbose", cursor: true })}
  ${por.svg}
  ${rows}
</svg>`;
}
