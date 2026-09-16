import { C, MONO, esc } from "./theme.mjs";

export const BAR = 36;

// Terminal window: rounded frame, title bar with three dots and a centred title.
export function windowFrame({ x = 0.5, y = 0.5, w, h, title, id = "win" }) {
  const W = w - 1, H = h - 1;
  return `
  <defs><clipPath id="${id}-clip"><rect x="${x}" y="${y}" width="${W}" height="${H}" rx="12"/></clipPath></defs>
  <g clip-path="url(#${id}-clip)">
    <rect x="${x}" y="${y}" width="${W}" height="${H}" fill="${C.ink}"/>
    <rect x="${x}" y="${y}" width="${W}" height="${BAR}" fill="${C.bar}"/>
    <line x1="${x}" y1="${y + BAR}" x2="${x + W}" y2="${y + BAR}" stroke="${C.line}"/>
  </g>
  <rect x="${x}" y="${y}" width="${W}" height="${H}" rx="12" fill="none" stroke="${C.line}"/>
  <circle cx="${x + 20}" cy="${y + BAR / 2}" r="5.5" fill="${C.accent}"/>
  <circle cx="${x + 38}" cy="${y + BAR / 2}" r="5.5" fill="#3a3a3f"/>
  <circle cx="${x + 56}" cy="${y + BAR / 2}" r="5.5" fill="#3a3a3f"/>
  <text x="${x + W / 2}" y="${y + BAR / 2 + 4}" text-anchor="middle" font-family="${MONO}" font-size="12" fill="${C.muted}">${esc(title)}</text>`;
}

// "amir@sarfaraz:~$ command" prompt line
export function prompt({ x, y, cmd, size = 13, cursor = false, delay = 0, cls = "" }) {
  const cw = size * 0.6;
  const user = "amir@sarfaraz";
  const path = ":~$ ";
  const cmdX = x + (user.length + path.length) * cw;
  const cursorX = cmdX + [...cmd].length * cw + 2;
  return `<g class="${cls}" style="animation-delay:${delay}s">
    <text x="${x}" y="${y}" font-family="${MONO}" font-size="${size}" xml:space="preserve"><tspan fill="${C.accent}">${user}</tspan><tspan fill="${C.muted}">${path}</tspan><tspan fill="${C.paper}">${esc(cmd)}</tspan></text>
    ${cursor ? `<rect class="cursor" x="${cursorX}" y="${y - size + 2}" width="${cw}" height="${size}" fill="${C.accent}"/>` : ""}
  </g>`;
}

// shared keyframes; every animated element stays visible if animations are not supported
export const baseCss = `
  .fade{animation:fade .5s ease-out both}
  .rise{animation:rise .6s cubic-bezier(.2,.7,.2,1) both}
  .type{animation:type .9s steps(40,end) both}
  .cursor{animation:blink 1s steps(1,end) infinite}
  @keyframes fade{from{opacity:0}to{opacity:1}}
  @keyframes rise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
  @keyframes type{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
  @keyframes blink{50%{opacity:0}}
  @media (prefers-reduced-motion: reduce){*{animation:none!important}}
`;
