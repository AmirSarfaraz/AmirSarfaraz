import { ArcadeRenderer } from "pacman-contribution-graph";

// Runs the Galaga game from pacman-contribution-graph and returns the SVG string.
export function playGalaga({ login, token, scenario }) {
  return new Promise((resolve, reject) => {
    const renderer = new ArcadeRenderer({
      game: "galaga",
      username: login,
      platform: scenario ? "scenario" : "github",
      scenario,
      gameTheme: "github-dark",
      showMonthLabels: true,
      githubSettings: { accessToken: token ?? "" },
      svgCallback: resolve,
      gameOverCallback: () => {},
    });
    Promise.resolve(renderer.start()).catch(reject);
  });
}
