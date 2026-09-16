import { readFileSync } from "node:fs";
import { C, WIDTH, MONO, esc, fontFaces, svgOpen, readable, monoWidth, path } from "../lib/theme.mjs";
import { windowFrame, prompt, baseCss, BAR } from "../lib/window.mjs";
import { stack } from "../data/profile.mjs";

const icons = JSON.parse(readFileSync(path("scripts/data/icons.json"), "utf8"));

function icon(key, x, y, size) {
  const ic = icons[key];
  if (!ic) return "";
  return `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="${ic.viewBox}" fill="${readable(ic.color)}">${ic.body}</svg>`;
}

export function renderStack() {
  const W = WIDTH, pad = 22, labelW = 118;
  const areaX = pad + labelW, areaW = W - pad - areaX;
  const chipH = 30, gap = 8, rowGap = 10, font = 12, iconSize = 16;
  let y = BAR + 56;
  let body = "";
  stack.forEach((grp, gi) => {
    const delay = (0.35 + gi * 0.16).toFixed(2);
    let x = areaX, rowY = y;
    let chips = "";
    for (const item of grp.items) {
      const [key, label] = item.split(":");
      const w = 10 + iconSize + 8 + monoWidth(label, font) + 12;
      if (x + w > areaX + areaW) { x = areaX; rowY += chipH + rowGap; }
      chips += `<g><rect x="${x}" y="${rowY}" width="${w.toFixed(1)}" height="${chipH}" rx="7" fill="${C.inkSoft}" stroke="${C.line}"/>
        ${icon(key, x + 10, rowY + (chipH - iconSize) / 2, iconSize)}
        <text x="${(x + 10 + iconSize + 8).toFixed(1)}" y="${rowY + chipH / 2 + 4}" font-family="${MONO}" font-size="${font}" fill="${C.paper}">${esc(label)}</text></g>`;
      x += w + gap;
    }
    let bottom = rowY + chipH;
    if (grp.also) {
      bottom += 20;
      chips += `<text x="${areaX + 2}" y="${bottom}" font-family="${MONO}" font-size="11.5" fill="${C.muted}"><tspan fill="${C.faint}">+ </tspan>${esc(grp.also)}</text>`;
      bottom += 4;
    }
    body += `<g class="rise" style="animation-delay:${delay}s">
      <text x="${pad}" y="${y + chipH / 2 + 4}" font-family="${MONO}" font-size="12" font-weight="600" fill="${C.accent}">${esc(grp.group)}/</text>
      ${chips}
    </g>`;
    y = bottom + 22;
    if (gi < stack.length - 1) body += `<line x1="${pad}" y1="${y - 11}" x2="${W - pad}" y2="${y - 11}" stroke="${C.line}" stroke-dasharray="2 4"/>`;
  });
  const H = Math.ceil(y + 4);
  return `${svgOpen(W, H, "Tech stack: languages, back end, data, front end, devops, AI and tools")}
  <style>${fontFaces()}${baseCss}</style>
  ${windowFrame({ w: W, h: H, title: "amir@sarfaraz: ~/stack" })}
  ${prompt({ x: pad, y: BAR + 26, cmd: "ls ~/stack --icons --group", cursor: false })}
  ${body}
</svg>`;
}
