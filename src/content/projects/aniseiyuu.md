---
title: 'Aniseiyuu'
date: '2020-11-17'
summary: "Compare the voice actors (seiyuu) of two anime to find characters who share a voice. It uses AniList's GraphQL API and started as a learning project. AniList's rate limits broke it in 2025, so I rewrote how it fetches data: it now loads each anime's cast directly, queues requests and retries when rate limited. I also moved it from Vue CLI to Vite."
tags: ['Vue', 'TypeScript', 'SCSS', 'GraphQL', 'Vite']
links:
  - label: 'Live'
    url: 'https://aniseiyuu.spimy.dev'
  - label: 'Code'
    url: 'https://github.com/spimy/aniseiyuu'
---

## What broke

AniSeiyuu finds the voice actors two anime have in common. The original version did this in two steps: it listed the cast of each anime, then for every shared actor it paged through their entire list of roles on AniList, 25 at a time. A popular actor can have hundreds of roles, so one comparison could send hundreds of requests at once. When AniList tightened its rate limits in July 2025, those requests started failing. The retry code for rate limit responses was never reached because it ran after code that assumed a successful response, and the loading spinner never stopped.

## Rethinking the comparison

The original algorithm compared every character in the first anime against every character in the second, intersecting their lists of voice actors each time. That is a nested loop over both casts, with an array scan inside it. It then took each matching actor and looked up their whole filmography to rebuild which characters they voiced in each show. The comparison itself was cheap to run but the lookup after it was the real cost, and it also had gaps: characters were deduplicated by name instead of id, and the role list it relied on was itself paginated.

The new version turns the problem around. For each anime I load the cast once and build a map from voice actor id to the characters they voice in that anime. Finding the shared actors is then a single pass: for each actor in the first map, check whether the second map has the same id. That is linear in the size of the two casts, and the characters for each actor are already attached, so there is no second round of lookups. It is faster, and the results are also more complete, because nothing depends on a truncated list.

## What I changed

- **A different approach.** Match voice actors by id using a map built from each anime's full cast, instead of looking up each shared actor's filmography.
- **A request queue.** Requests go out one at a time with a short gap between them. On a 429 response it waits and retries, and results are cached for the session.
- **Complete casts.** The old version only looked at the first 25 characters of each anime. It now pages through the whole cast.
- **Real error handling.** Failures show a message and the spinner always stops.
- **Tooling.** I moved the project from Vue CLI and webpack to Vite, updated Vue, Vue Router and TypeScript, switched to pnpm, and added a dev container.

## What I learned

Rate limits are part of an API's design, not an edge case. Building the request path to expect them (queue, retry, visible errors) would have saved the project in 2025.
