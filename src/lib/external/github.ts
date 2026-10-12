let cached: { at: number; value: GitHubStats } | null = null;
const CACHE_MS = 10 * 60 * 1000;

const query = `
  query ($login: String!, $ytdFrom: DateTime!, $recentFrom: DateTime!, $to: DateTime!) {
    user(login: $login) {
      ytd: contributionsCollection(from: $ytdFrom, to: $to) {
        totalCommitContributions
        restrictedContributionsCount
      }
      recent: contributionsCollection(from: $recentFrom, to: $to) {
        contributionCalendar {
          weeks { contributionDays { date contributionCount } }
        }
      }
    }
  }`;

export interface GitHubStats {
  commitsYtd: number;
  activeDays: number;
}

export async function getGitHubStats(
  login: string,
  token: string | undefined,
): Promise<GitHubStats | null> {
  if (!token) return null;
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.value;

  const now = new Date();
  const yearStart = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
  const yearAgo = new Date(now.getTime() - 364 * 24 * 60 * 60 * 1000);

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          login,
          ytdFrom: yearStart.toISOString(),
          recentFrom: yearAgo.toISOString(),
          to: now.toISOString(),
        },
      }),
    });
    if (!res.ok) {
      console.error('[GitHub] HTTP', res.status, await res.text());
      return null;
    }

    const json = await res.json();
    if (json.errors || !json.data?.user) {
      console.error(
        '[GitHub] GraphQL error',
        JSON.stringify(json.errors ?? json),
      );
      return null;
    }

    const { ytd, recent } = json.data.user;
    const days: { date: string; contributionCount: number }[] =
      recent.contributionCalendar.weeks.flatMap((w: any) => w.contributionDays);

    const activeDays = days.filter((d) => d.contributionCount > 0).length;

    const value = {
      commitsYtd:
        ytd.totalCommitContributions + ytd.restrictedContributionsCount,
      activeDays,
    };
    cached = { at: Date.now(), value };

    return value;
  } catch (err) {
    console.error('[GitHub] request failed', err);
    return null;
  }
}
