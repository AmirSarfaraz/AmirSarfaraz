// Builds every SVG of the profile into assets/ (committed; the README links to these files).
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { fetchCalendar } from "./lib/contributions.mjs";
import { playGalaga } from "./lib/galaga.mjs";
import { renderHeader } from "./render/header.mjs";
import { renderButton } from "./render/buttons.mjs";
import { renderWhoami } from "./render/whoami.mjs";
import { renderContributions } from "./render/contributions.mjs";
import { renderStack } from "./render/stack.mjs";
import { renderProjectCard } from "./render/projects.mjs";
import { links, projects } from "./data/profile.mjs";

const login = process.env.PROFILE_LOGIN ?? "AmirSarfaraz";
const out = process.env.OUT_DIR ?? "assets";

rmSync(out, { recursive: true, force: true });
mkdirSync(`${out}/projects`, { recursive: true });
const write = (file, svg) => {
  writeFileSync(`${out}/${file}`, svg);
  console.log(`  ${file}  ${(svg.length / 1024).toFixed(0)} KB`);
};

const calendar = await fetchCalendar(login);
const asOf = new Date().toLocaleString("en-US", { month: "short", year: "numeric" });
console.log(`calendar: ${calendar.total} contributions in ${calendar.weeks.length} weeks (as of ${asOf})`);

write("header.svg", renderHeader());
for (const link of links) write(`btn-${link.key}.svg`, renderButton(link));
write("whoami.svg", renderWhoami());
const gameSvg = await playGalaga({ login, calendar });
write("contributions.svg", renderContributions({ gameSvg, total: calendar.total, asOf }));
write("stack.svg", renderStack());
projects.forEach((p, i) => write(`projects/${p.slug}.svg`, renderProjectCard(p, i)));
