// Reads the public contribution calendar (no token needed) from github.com/users/<login>/contributions.
const LEVELS = ["NONE", "FIRST_QUARTILE", "SECOND_QUARTILE", "THIRD_QUARTILE", "FOURTH_QUARTILE"];
const COLORS = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];

export async function fetchCalendar(login) {
  const res = await fetch(`https://github.com/users/${login}/contributions`, { headers: { "User-Agent": "profile-art" } });
  if (!res.ok) throw new Error(`contribution calendar: ${res.status}`);
  const html = await res.text();

  const counts = new Map();
  for (const m of html.matchAll(/<tool-tip[^>]*for="(contribution-day-component-\d+-\d+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const n = m[2].match(/^(\d+) contributions?/);
    counts.set(m[1], n ? Number(n[1]) : 0);
  }

  const weeks = [];
  for (const m of html.matchAll(/<td[^>]*class="ContributionCalendar-day"[^>]*>/g)) {
    const tag = m[0];
    const attr = (name) => (tag.match(new RegExp(`${name}="([^"]*)"`)) || [])[1];
    const id = attr("id");
    const date = attr("data-date");
    const level = Number(attr("data-level") ?? 0);
    const [, day, week] = id.match(/(\d+)-(\d+)$/).map(Number);
    weeks[week] ??= { contributionDays: [] };
    weeks[week].contributionDays[day] = {
      date,
      contributionCount: counts.get(id) ?? 0,
      color: COLORS[level],
      contributionLevel: LEVELS[level],
    };
  }

  const clean = weeks.filter(Boolean).map((w) => ({ contributionDays: w.contributionDays.filter(Boolean) }));
  const totalText = (html.match(/([\d,]+)\s*contributions?\s*in the last year/) || [])[1] ?? "0";
  return { total: Number(totalText.replace(/,/g, "")), weeks: clean };
}
