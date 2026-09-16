// One-off (not run by CI). Needs `npm i subset-font @fontsource/geist-mono @fontsource/unbounded simple-icons` locally.
// One-off: collect monochrome icons (simple-icons CC0 + devicon MIT) into scripts/data/icons.json
import * as si from "simple-icons";
import { writeFileSync } from "node:fs";

const simple = {
  dotnet: "dotnet", typescript: "typescript", javascript: "javascript", python: "python", html5: "html5", css: "css",
  react: "react", nextjs: "nextdotjs", vite: "vite", tailwind: "tailwindcss", reactquery: "reactquery", reactrouter: "reactrouter",
  reacthookform: "reacthookform", zod: "zod", motion: "framer", gsap: "greensock", bootstrap: "bootstrap", jquery: "jquery",
  postgresql: "postgresql", mysql: "mysql", redis: "redis", rabbitmq: "rabbitmq", meilisearch: "meilisearch", jwt: "jsonwebtokens",
  swagger: "swagger", docker: "docker", nginx: "nginx", githubactions: "githubactions", git: "git", github: "github", minio: "minio",
  vercel: "vercel", postman: "postman", pytorch: "pytorch", onnx: "onnx", opencv: "opencv", fastapi: "fastapi", scikitlearn: "scikitlearn",
  numpy: "numpy", claude: "claude", cursor: "cursor", copilot: "githubcopilot", telegram: "telegram",
};
const devicon = {
  csharp: "csharp", aspnetcore: "dotnetcore", efcore: "entityframeworkcore", sqlserver: "microsoftsqlserver",
  visualstudio: "visualstudio", vscode: "vscode", zustand: "zustand", linkedin: "linkedin",
};
const out = {};
const bySlug = Object.fromEntries(Object.values(si).filter((x) => x && x.slug).map((x) => [x.slug, x]));
for (const [key, slug] of Object.entries(simple)) {
  const icon = bySlug[slug];
  if (!icon) { console.log("missing simple", slug); continue; }
  out[key] = { title: icon.title, viewBox: "0 0 24 24", body: `<path d="${icon.path}"/>`, color: `#${icon.hex}`, source: "simple-icons" };
}
for (const [key, name] of Object.entries(devicon)) {
  const res = await fetch(`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${name}/${name}-plain.svg`);
  if (!res.ok) { console.log("missing devicon", name, res.status); continue; }
  const svg = await res.text();
  const viewBox = (svg.match(/viewBox="([^"]+)"/) || [])[1] || "0 0 128 128";
  const colorMatch = svg.match(/fill="(#[0-9a-fA-F]{3,6})"/);
  const body = svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "")
    .replace(/\s(fill|style|class|id)="[^"]*"/g, "").replace(/<title>[\s\S]*?<\/title>/g, "").replace(/<defs>[\s\S]*?<\/defs>/g, "").trim();
  out[key] = { title: name, viewBox, body, color: colorMatch ? colorMatch[1] : "#efede8", source: "devicon" };
}
// the website's own icon (same drawing as site/src/app/icon.svg, without the tile)
out.site = { title: "site", viewBox: "0 0 32 32", color: "#ff4d2e", source: "own",
  body: '<path d="M6 9v15c0 1.66 4.48 3 10 3s10-1.34 10-3V9z" fill="#ff4d2e"/><path d="M6 16.5c0 1.66 4.48 3 10 3s10-1.34 10-3" fill="none" stroke="#0b0b0c" stroke-width="2.4"/><ellipse cx="16" cy="9" rx="10" ry="3" fill="#efede8"/><path d="M6 9c0 1.66 4.48 3 10 3s10-1.34 10-3" fill="none" stroke="#0b0b0c" stroke-width="1.2"/>' };
writeFileSync("scripts/data/icons.json", JSON.stringify(out));
console.log("icons", Object.keys(out).length, Object.entries(out).map(([k, v]) => `${k}:${v.color}`).join(" "));
