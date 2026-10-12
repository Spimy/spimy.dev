let cached: { at: number; value: number } | null = null;
const CACHE_MS = 10 * 60 * 1000;

const query = `
  query ($userName: String, $chunk: Int) {
    MediaListCollection(
      userName: $userName
      type: ANIME
      status: COMPLETED
      forceSingleCompletedList: true
      chunk: $chunk
      perChunk: 500
    ) {
      hasNextChunk
      lists { entries { id } }
    }
  }`;

export async function getCompletedAnime(
  userName: string,
): Promise<number | null> {
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.value;

  try {
    let count = 0;
    let chunk = 1;
    let hasNext = true;

    while (hasNext && chunk <= 20) {
      const res = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ query, variables: { userName, chunk } }),
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) {
        console.error('[AniList] HTTP', res.status, await res.text());
        return null;
      }

      const json = await res.json();
      const collection = json.data?.MediaListCollection;
      if (json.errors || !collection) {
        console.error(
          '[AniList] GraphQL error',
          JSON.stringify(json.errors ?? json),
        );
        return null;
      }

      for (const list of collection.lists) count += list.entries.length;
      hasNext = collection.hasNextChunk;
      chunk++;
    }

    cached = { at: Date.now(), value: count };
    return count;
  } catch (err) {
    console.error('[AniList] request failed', err);
    return null;
  }
}
