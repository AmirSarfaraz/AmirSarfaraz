import { readFileSync } from "node:fs";
import { C, MONO, esc, fontFaces, svgOpen, readable, monoWidth, path } from "../lib/theme.mjs";

const icons = JSON.parse(readFileSync(path("scripts/data/icons.json"), "utf8"));
export const BUTTON_W = 206, BUTTON_H = 42;

export function renderButton(link) {
  const W = BUTTON_W, H = BUTTON_H;
  const ic = icons[link.icon];
  const iconColor = readable(ic.color);
  const cmdX = 44;
  return `${svgOpen(W, H, `${link.label}: ${link.href}`)}
  <style>${fontFaces()}</style>
  <rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="10" fill="${C.ink}" stroke="${C.line}"/>
  <svg x="16" y="${(H - 16) / 2}" width="16" height="16" viewBox="${ic.viewBox}" fill="${iconColor}">${ic.body}</svg>
  <text x="${cmdX}" y="${H / 2 + 4.5}" font-family="${MONO}" font-size="13" xml:space="preserve"><tspan fill="${C.accent}">$</tspan><tspan fill="${C.muted}"> open </tspan><tspan fill="${C.paper}">${esc(link.label)}</tspan></text>
  <text x="${W - 16}" y="${H / 2 + 4.5}" text-anchor="end" font-family="${MONO}" font-size="13" fill="${C.faint}">↗</text>
</svg>`;
}
