import { ArcadeRenderer } from "pacman-contribution-graph";

// Runs the Galaga game from pacman-contribution-graph. The library asks the GitHub GraphQL API for the
// calendar; that request is answered with the public calendar read in contributions.mjs, so no token is needed.
export async function playGalaga({ login, calendar, scenario }) {
  const realFetch = globalThis.fetch;
  if (calendar) {
    globalThis.fetch = async (url, init) => {
      if (String(url).includes("api.github.com/graphql")) {
        const body = { data: { user: { contributionsCollection: { contributionCalendar: { weeks: calendar.weeks } } } } };
        return new Response(JSON.stringify(body), { status: 200, headers: { "Content-Type": "application/json" } });
      }
      return realFetch(url, init);
    };
  }
  try {
    return await new Promise((resolve, reject) => {
      const renderer = new ArcadeRenderer({
        game: "galaga",
        username: login,
        platform: scenario ? "scenario" : "github",
        scenario,
        gameTheme: "github-dark",
        showMonthLabels: true,
        githubSettings: { accessToken: calendar ? "public-calendar" : "" },
        svgCallback: resolve,
        gameOverCallback: () => {},
      });
      Promise.resolve(renderer.start()).catch(reject);
    });
  } finally {
    globalThis.fetch = realFetch;
  }
}
