// Public numbers for the profile card. With a token (GitHub Actions) the GraphQL API also gives the contribution total.
export async function fetchStats({ login, token }) {
  const refreshed = new Date().toISOString().slice(0, 10);
  if (token) {
    const query = `query($login:String!){user(login:$login){followers{totalCount} repositories(ownerAffiliations:OWNER, privacy:PUBLIC){totalCount} contributionsCollection{contributionCalendar{totalContributions}}}}`;
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "User-Agent": "profile-art" },
      body: JSON.stringify({ query, variables: { login } }),
    });
    const json = await res.json();
    if (!res.ok || json.errors) throw new Error(`GitHub GraphQL failed: ${res.status} ${JSON.stringify(json.errors ?? json)}`);
    const u = json.data.user;
    return {
      followers: u.followers.totalCount,
      publicRepos: u.repositories.totalCount,
      contributions: u.contributionsCollection.contributionCalendar.totalContributions,
      refreshed,
    };
  }
  const res = await fetch(`https://api.github.com/users/${login}`, { headers: { "User-Agent": "profile-art" } });
  if (!res.ok) throw new Error(`GitHub REST failed: ${res.status}`);
  const u = await res.json();
  return { followers: u.followers, publicRepos: u.public_repos, contributions: 0, refreshed };
}
