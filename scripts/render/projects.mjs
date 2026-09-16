import { C, MONO, esc, fontFaces, svgOpen, monoWidth } from "../lib/theme.mjs";
import { baseCss } from "../lib/window.mjs";

export const CARD_W = 420, CARD_H = 164;

export function renderProjectCard(p, index = 0) {
  const W = CARD_W, H = CARD_H, bar = 30;
  const statusColor = p.live ? C.accent : C.muted;
  const statusW = monoWidth(p.status, 11) + 26;
  let tagX = 18;
  const tags = p.tags.map((t) => {
    const w = monoWidth(t, 11) + 16;
    const out = `<rect x="${tagX}" y="${H - 38}" width="${w}" height="22" rx="5" fill="${C.inkSoft}" stroke="${C.line}"/><text x="${tagX + 8}" y="${H - 23}" font-family="${MONO}" font-size="11" fill="${C.paperDim}">${esc(t)}</text>`;
    tagX += w + 6;
    return out;
  }).join("");
  return `${svgOpen(W, H, `${p.name}: ${p.text.join(" ")}`)}
  <style>${fontFaces()}${baseCss}</style>
  <defs><clipPath id="c"><rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="12"/></clipPath></defs>
  <g class="rise" style="animation-delay:${(0.1 + index * 0.08).toFixed(2)}s">
    <g clip-path="url(#c)">
      <rect width="${W}" height="${H}" fill="${C.ink}"/>
      <rect width="${W}" height="${bar}" fill="${C.bar}"/>
      <line x1="0" y1="${bar}" x2="${W}" y2="${bar}" stroke="${C.line}"/>
    </g>
    <rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="12" fill="none" stroke="${C.line}"/>
    <circle cx="16" cy="${bar / 2}" r="4.5" fill="${C.accent}"/><circle cx="30" cy="${bar / 2}" r="4.5" fill="#3a3a3f"/><circle cx="44" cy="${bar / 2}" r="4.5" fill="#3a3a3f"/>
    <text x="60" y="${bar / 2 + 4}" font-family="${MONO}" font-size="11" fill="${C.muted}">~/projects/${esc(p.slug)}</text>
    <g>
      <rect x="${W - 12 - statusW}" y="7" width="${statusW}" height="16" rx="8" fill="none" stroke="${p.live ? "#5a2418" : C.line}"/>
      <circle cx="${W - 12 - statusW + 10}" cy="15" r="3" fill="${statusColor}">${p.live ? `<animate attributeName="opacity" values="1;.25;1" dur="2s" repeatCount="indefinite"/>` : ""}</circle>
      <text x="${W - 12 - statusW + 18}" y="19" font-family="${MONO}" font-size="11" fill="${statusColor}">${esc(p.status)}</text>
    </g>
    <text x="18" y="${bar + 32}" font-family="${MONO}" font-size="18" font-weight="600" fill="${C.paper}">${esc(p.name)}</text>
    <text x="${W - 18}" y="${bar + 32}" text-anchor="end" font-family="${MONO}" font-size="13" fill="${C.faint}">↗</text>
    ${p.text.map((t, i) => `<text x="18" y="${bar + 56 + i * 18}" font-family="${MONO}" font-size="11.5" fill="${C.paperDim}">${esc(t)}</text>`).join("")}
    ${tags}
  </g>
</svg>`;
}
