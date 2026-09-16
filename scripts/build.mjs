// Builds every SVG of the profile into OUT_DIR (published to the `output` branch by the workflow).
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { fetchStats } from "./lib/github.mjs";
import { playGalaga } from "./lib/galaga.mjs";
import { renderHeader } from "./render/header.mjs";
import { renderButton } from "./render/buttons.mjs";
import { renderWhoami } from "./render/whoami.mjs";
import { renderContributions } from "./render/contributions.mjs";
import { renderStack } from "./render/stack.mjs";
import { renderProjectCard } from "./render/projects.mjs";
import { links, projects } from "./data/profile.mjs";

const login = process.env.PROFILE_LOGIN ?? "AmirSarfaraz";
const token = process.env.GITHUB_TOKEN;
const out = process.env.OUT_DIR ?? "dist";
const scenario = process.env.GALAGA_SCENARIO; // local previews only

rmSync(out, { recursive: true, force: true });
mkdirSync(`${out}/projects`, { recursive: true });
const write = (file, svg) => { writeFileSync(`${out}/${file}`, svg); console.log(`  ${file}  ${(svg.length / 1024).toFixed(0)} KB`); };

const stats = await fetchStats({ login, token });
console.log("stats", stats);

write("header.svg", renderHeader());
for (const link of links) write(`btn-${link.key}.svg`, renderButton(link));
write("whoami.svg", renderWhoami(stats));
if (token || scenario) {
  const gameSvg = await playGalaga({ login, token, scenario });
  write("contributions.svg", renderContributions({ gameSvg, total: stats.contributions }));
} else {
  console.log("  contributions.svg skipped (no token and no GALAGA_SCENARIO)");
}
write("stack.svg", renderStack());
projects.forEach((p, i) => write(`projects/${p.slug}.svg`, renderProjectCard(p, i)));
